import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ethers } from 'ethers';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async loginOrRegister(
    address: string,
    nonce: string,
    signature: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      let user = await this.userRepository.findOne({ where: { address } });

      if (!user) {
        user = await this.createUser(address);

        console.log(`Created user: ${JSON.stringify(user)}`);
      }

      const isValid = await this.validateSignature(address, nonce, signature);

      console.log(`isValid: ${isValid}`);

      if (!isValid) {
        throw new UnauthorizedException('Invalid signature');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new Error(`Failed to login or register: ${error.message}`);
    }
  }

  async createUser(address: string): Promise<User> {
    try {
      console.log(`Creating user with address: ${address}`);

      const newUser = this.userRepository.create({
        address,
        nonce: this.generateNonce(),
      });

      console.log(`New user: ${JSON.stringify(newUser)}`);

      return this.userRepository.save(newUser);
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async validateSignature(
    address: string,
    nonce: string,
    signature: string,
  ): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { address } });

    if (!user || user.nonce !== nonce) {
      return false;
    }

    const message = `Login to DApp with nonce: ${nonce}`;
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      console.log(`Recovered address: ${recoveredAddress}`);
      return recoveredAddress.toLowerCase() === address.toLowerCase();
    } catch (error) {
      Logger.error(`Failed to verify signature: ${error.message}`);
      return false;
    }
  }

  async generateTokens(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { address: user.address, nonce: user.nonce };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.generateRefreshToken();

    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.save(user);

    return { accessToken, refreshToken };
  }

  async getNonce(address: string): Promise<string> {
    try {
      let user = await this.userRepository.findOne({ where: { address } });
      if (!user) {
        user = await this.createUser(address);
      }
      return user.nonce;
    } catch (error) {
      throw new Error(`Failed to get nonce: ${error.message}`);
    }
  }

  async refreshToken(
    address: string,
    refreshToken: string,
  ): Promise<{
    accessToken: string;
    newRefreshToken: string;
    address: string;
  }> {
    try {
      const user = await this.userRepository.findOne({ where: { address } });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const isRefreshTokenValid = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );
      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await this.generateTokens(user);
      return { accessToken, newRefreshToken, address: user.address };
    } catch (error) {
      throw new Error(`Failed to refresh token: ${error.message}`);
    }
  }

  async logout(address: string): Promise<void> {
    try {
      await this.userRepository.update({ address }, { refreshToken: null });
    } catch (error) {
      throw new Error(`Failed to logout: ${error.message}`);
    }
  }

  private generateNonce(): string {
    return Math.floor(Math.random() * 1000000).toString();
  }

  private generateRefreshToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}

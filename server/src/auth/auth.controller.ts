import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async loginOrRegister(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const { accessToken, refreshToken } =
        await this.authService.loginOrRegister(
          loginDto.address,
          loginDto.nonce,
          loginDto.signature,
        );

      response.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid signature or login failed');
    }
  }

  @Post('refresh')
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refreshToken'];
    const address = request.body.address;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      const {
        accessToken,
        newRefreshToken,
        address: userAddress,
      } = await this.authService.refreshToken(address, refreshToken);

      // Set new refresh token as HTTP-only cookie
      response.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return { accessToken, userAddress };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  @Post('nonce')
  async getNonce(@Body('address') address: string) {
    try {
      const nonce = await this.authService.getNonce(address);
      return { nonce };
    } catch (error) {
      throw new Error(`Failed to get nonce: ${error.message}`);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const address = request.user['address'];
    await this.authService.logout(address);

    response.clearCookie('refreshToken');

    return { message: 'Logged out successfully' };
  }
}

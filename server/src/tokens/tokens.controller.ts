import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { TokensService } from './tokens.service';
import { AuthUser } from 'src/auth/decorators/current-user.decorator';

@Controller('tokens')
@ApiBearerAuth()
export class TokensController {
  constructor(private tokensService: TokensService) {}

  @Get()
  @ApiOperation({ summary: 'Get tokens history' })
  @ApiQuery({
    name: 'network',
    enum: [
      'eth-mainnet',
      'eth-sepolia',
      // 'bnb',
      // 'arbitrum',
      // 'optimism',
      // 'base',
      // 'linea',
      // 'polygon',
    ],
    required: false,
  })
  @ApiQuery({ name: 'address', required: false })
  @ApiResponse({
    status: 200,
    description: 'Returns the transaction history',
    type: Object,
  })
  async getTokens(
    @Res() res: Response,
    @Query('network') network: string,
    @Query('address') queryAddress: string,
    @AuthUser('address') userAddress?: string,
  ) {
    const address = queryAddress || userAddress;

    if (!address) {
      throw new Error('No address provided and no user address found');
    }

    const tokens = await this.tokensService.getTokens(address, network);

    return res.status(200).json(tokens);
  }

  @Get('nft')
  @ApiOperation({ summary: 'Get nft tokens history' })
  @ApiQuery({
    name: 'network',
    enum: [
      'eth-mainnet',
      'eth-sepolia',
      // 'bnb',
      // 'arbitrum',
      // 'optimism',
      // 'base',
      // 'linea',
      // 'polygon',
    ],
    required: false,
  })
  @ApiQuery({ name: 'address', required: false })
  @ApiResponse({
    status: 200,
    description: 'Returns the nft tokens history',
    type: Object,
  })
  async getNftTokens(
    @Res() res: Response,
    @Query('network') network: string,
    @Query('address') queryAddress: string,
    @AuthUser('address') userAddress?: string,
  ) {
    const address = queryAddress || userAddress;

    if (!address) {
      throw new Error('No address provided and no user address found');
    }

    const nfts = await this.tokensService.getNftBalance(address, network);

    return res.status(200).json(nfts);
  }

  @Get('test')
  @ApiQuery({ name: 'address', required: false })
  @ApiResponse({
    status: 200,
    description: 'Returns the nft tokens history',
    type: Object,
  })
  @ApiQuery({
    name: 'network',
    enum: [
      '0x1',
      '0xaa36a7',
      // 'bnb',
      // 'arbitrum',
      // 'optimism',
      // 'base',
      // 'linea',
      // 'polygon',
    ],
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the nft tokens history',
    type: Object,
  })
  async test(
    @Query('address')
    address: string,
    @Query('network') network?: '0x1' | '0xaa36a7',
  ) {
    return await this.tokensService.getTokensByAddressMoralis(address, network);
  }
}

import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TransactionService } from './transactions.service';
import { TransactionResponse } from 'ethers';
import { AuthUser } from 'src/auth/decorators/current-user.decorator';

@ApiTags('transactions')
@Controller('transactions')
@ApiBearerAuth()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @ApiOperation({ summary: 'Get transaction history' })
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
  @ApiQuery({ name: 'fromBlock', required: false })
  @ApiQuery({ name: 'toBlock', required: false })
  @ApiQuery({ name: 'tokenAddress', required: false })
  @ApiQuery({ name: 'includeAllTokens', required: false, type: 'boolean' })
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'fromTimestamp', required: false, type: 'number' })
  @ApiQuery({ name: 'toTimestamp', required: false, type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Returns the transaction history',
    type: TransactionResponse,
  })
  async getTransactions(
    @Res() res: Response,
    @Query('network') network: string,
    @Query('address') queryAddress: string,
    @Query('fromBlock') fromBlock: number,
    @Query('toBlock') toBlock: number,
    @Query('tokenAddress') tokenAddress?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('fromTimestamp') fromTimestamp?: number,
    @Query('toTimestamp') toTimestamp?: number,
    @AuthUser('address') userAddress?: string,
  ) {
    const address = queryAddress || userAddress;

    if (!address) {
      throw new Error('No address provided and no user address found');
    }

    const transactions = await this.transactionService.getTransactions(
      address,
      network,
      tokenAddress,
      toBlock,
      fromBlock,
      page,
      limit,
      fromTimestamp,
      toTimestamp,
    );

    return res.status(200).json(transactions);
  }
}

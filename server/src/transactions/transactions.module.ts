import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransactionController } from './transactions.controller';
import { TransactionService } from './transactions.service';
import { TransactionsGateway } from './transactions.gateway';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, ConfigService, TransactionsGateway],
})
export class TransactionsModule {}

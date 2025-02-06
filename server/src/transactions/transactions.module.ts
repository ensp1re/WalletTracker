import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransactionController } from './transactions.controller';
import { TransactionService } from './transactions.service';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, ConfigService],
})
export class TransactionsModule {}

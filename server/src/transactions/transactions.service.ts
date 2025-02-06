import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoldRushClient, Transaction } from '@covalenthq/client-sdk';
import { Chain } from '@covalenthq/client-sdk';
import { stringifyBigInt } from 'src/lib/utils';

@Injectable()
export class TransactionService {
  private provider: GoldRushClient;

  constructor(private configService: ConfigService) {
    this.provider = new GoldRushClient(this.configService.get('api'));
  }

  async getTransactions(
    address: string,
    network?: string,
    _tokenAddress?: string,
    toBlock?: number,
    fromBlock?: number,
    page: number = 1,
    limit: number = 10,
    fromTimestamp?: number,
    toTimestamp?: number,
  ) {
    try {
      const networksToFetch: Chain[] = [
        'eth-mainnet',
        'eth-sepolia',
        // 'bsc-mainnet',
        // 'arbitrum-mainnet',
        // 'optimism-mainnet',
        // 'base-mainnet',
        // 'linea-mainnet',
        // 'matic-mainnet',
      ];

      let allTransactions: Transaction[] = [];

      if (!page) page = 1;
      if (!limit) limit = 10;

      let response = Object();

      if (network === 'eth-mainnet') {
        response =
          this.provider.TransactionService.getAllTransactionsForAddress(
            networksToFetch[0],
            address,
          );
      } else if (network === 'eth-sepolia') {
        response =
          this.provider.TransactionService.getAllTransactionsForAddress(
            networksToFetch[1],
            address,
          );
      } else {
        throw new Error('Invalid network');
      }

      for await (const res of response) {
        if (res.data && !res.error) {
          for (const tx of res.data.items) {
            allTransactions.push(tx);
          }
        } else {
          Logger.error('Error fetching transactions', res.error_message);
        }
      }

      // filter
      const filteredTransactions = allTransactions.filter((tx) => {
        if (toBlock && tx.block_height > toBlock) return false;
        if (fromBlock && tx.block_height < fromBlock) return false;
        if (
          fromTimestamp &&
          new Date(tx.block_signed_at).getTime() < fromTimestamp * 1000
        )
          return false;
        if (
          toTimestamp &&
          new Date(tx.block_signed_at).getTime() > toTimestamp * 1000
        )
          return false;
        return true;
      });

      // pagination
      const startIndex = (page - 1) * limit;
      const paginatedTransactions = filteredTransactions.slice(
        startIndex,
        startIndex + limit,
      );

      return {
        transactions: stringifyBigInt(
          paginatedTransactions.map((tx: Transaction) => ({
            ...tx,
            value:
              typeof tx.value === 'bigint' ? tx.value.toString() : tx.value,
            fees_paid:
              typeof tx.fees_paid === 'bigint'
                ? tx.fees_paid.toString()
                : tx.fees_paid,
          })),
        ),
        total: filteredTransactions.length,
        page,
        limit,
      };
    } catch (error) {
      Logger.error('Error in getTransactions', error, { network, address });
      throw new Error('Error in getTransactions');
    }
  }
}

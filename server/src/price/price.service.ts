import { Injectable } from '@nestjs/common';
import CoinGecko from 'coingecko-api';

@Injectable()
export class PriceService {
  //   private coinGeckoClient: CoinGecko;

  constructor() {
    // this.coinGeckoClient = new CoinGecko();
  }

  //   async getTokenPrice(
  //     tokenAddress: string,
  //     network: string,
  //   ): Promise<number | null> {
  //     try {
  //       const platformId = this.getPlatformId(network);

  //       return response.data[tokenAddress.toLowerCase()].usd || null;
  //     } catch (error) {
  //       console.error(error);
  //       throw new Error(`getTokenPrice failed: ${error.message}`);
  //     }
  //   }

  //   private getPlatformId(network: string): string {
  //     switch (network) {
  //       case 'ethereum':
  //         return 'ethereum';
  //       case 'bnb':
  //         return 'binance-smart-chain';
  //       case 'arbitrum':
  //         return 'arbitrum-one';
  //       case 'optimism':
  //         return 'optimistic-ethereum';
  //       case 'base':
  //         return 'base';
  //       case 'linea':
  //         return 'linea';
  //       default:
  //         throw new Error(`Unsupported network: ${network}`);
  //     }
  //   }
}

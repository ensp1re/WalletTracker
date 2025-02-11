import {
  BalanceItem,
  BalancesResponse,
  Chain,
  GoldRushClient,
  GoldRushResponse,
  NftAddressBalanceNftResponse,
  NftTokenContractBalanceItem,
} from '@covalenthq/client-sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { stringifyBigInt } from 'src/lib/utils';
import Moralis from 'moralis';

@Injectable()
export class TokensService {
  private provider: GoldRushClient;
  public networksToFetch: Chain[] = ['eth-mainnet', 'eth-sepolia'];

  constructor(private configService: ConfigService) {
    this.provider = new GoldRushClient(this.configService.get('api'));
  }

  async getTokensByAddressMoralis(
    address: string,
    network?: '0x1' | '0xaa36a7',
  ): Promise<any> {
    try {
      await Moralis.start({
        apiKey: '',
      });

      const result = [];

      const response = await Moralis.EvmApi.token.getWalletTokenBalances({
        chain: network,
        address: address,
      });

      if (network === '0x1') {
        for (const token of response.raw) {
          try {
            const responsePrice = await Moralis.EvmApi.token.getTokenPrice({
              chain: '0x1',
              include: 'percent_change',
              address: token.token_address,
            });

            if (responsePrice) {
              token['price'] = responsePrice.raw;
            } else {
              token['price'] = 0;
            }
          } catch (error) {
            if (
              error.message.includes(
                'No liquidity pools found for the specified token address',
              )
            ) {
              console.warn(
                `No liquidity pools found for token address: ${token.token_address}`,
              );
            } else if (
              error.message.includes(
                'Insufficient liquidity in pools to calculate the price',
              )
            ) {
              console.warn(
                `Insufficient liquidity in pools to calculate the price for token address: ${token.token_address}`,
              );
            } else {
              throw error;
            }
          }
          result.push(token);
        }
      } else if (network === '0xaa36a7') {
        result.push(response.raw);
      }

      return {
        tokens: result,
        totalTokens: result.length,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getTokens(address: string, network?: string): Promise<any> {
    try {
      let allTokens: BalanceItem[] = [];

      let response: GoldRushResponse<BalancesResponse> = Object();

      if (network === 'eth-mainnet') {
        response =
          await this.provider.BalanceService.getTokenBalancesForWalletAddress(
            this.networksToFetch[0],
            address,
          );
        console.log(response.data.items);
      } else if (network === 'eth-sepolia') {
        response =
          await this.provider.BalanceService.getTokenBalancesForWalletAddress(
            this.networksToFetch[1],
            address,
          );
      } else {
        throw new Error('Invalid network');
      }

      for (const balance of response.data.items) {
        allTokens.push(balance);
      }

      const totalCosts = allTokens.reduce(
        (acc, token) =>
          acc +
          (token.quote_rate
            ? (Number(token.balance) / 10 ** token.contract_decimals) *
              token.quote_rate
            : 0),
        0,
      );

      return {
        tokens: stringifyBigInt(allTokens),
        totalCost: totalCosts,
        totalTokens: allTokens.length,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getNftBalance(address: string, network?: string): Promise<any> {
    try {
      let allNfts: NftTokenContractBalanceItem[] = [];

      let response: GoldRushResponse<NftAddressBalanceNftResponse> = Object();

      if (network === 'eth-mainnet') {
        response = await this.provider.NftService.getNftsForAddress(
          this.networksToFetch[0],
          address,
        );
      } else if (network === 'eth-sepolia') {
        response =
          (await this.provider.BalanceService.getTokenBalancesForWalletAddress(
            this.networksToFetch[1],
            address,
          )) as GoldRushResponse<NftAddressBalanceNftResponse>;
      } else {
        throw new Error('Invalid network');
      }

      for (const nft of response.data.items) {
        allNfts.push(nft);
      }

      return {
        nfts: stringifyBigInt(allNfts),
        totalNfts: allNfts.length,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}

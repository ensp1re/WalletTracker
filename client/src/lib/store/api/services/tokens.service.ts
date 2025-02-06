import { BalanceItem } from "@covalenthq/client-sdk";
import { baseApi } from "../baseApi";

export const tokensApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTokens: build.query<
      {
        tokens: BalanceItem[];
        totalCost: number;
        totalTokens: number;
      },
      { address: string | undefined; network: string | undefined }
    >({
      query: ({ address, network }) => ({
        url: "tokens",
        method: "GET",
        params: { address, network },
      }),
    }),
    getNftBalance: build.query<
      {
          nfts: never[]; balance: number 
},
      { address: string | undefined; network: string | undefined }
    >({
      query: ({ address, network }) => ({
        url: "tokens/nft",
        method: "GET",
        params: { address, network },
      }),
    }),
  }),
});

export const { useGetTokensQuery, useGetNftBalanceQuery } = tokensApi;

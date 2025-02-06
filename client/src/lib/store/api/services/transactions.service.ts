import { baseApi } from "../baseApi";

export const tokensApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTransactions: build.query({
      query: ({
        address,
        network,
        _tokenAddress,
        toBlock,
        fromBlock,
        page = 1,
        limit = 10,
        fromTimestamp,
        toTimestamp,
      }) => ({
        url: `/transactions`,
        params: {
          address,
          network,
          tokenAddress: _tokenAddress,
          toBlock,
          fromBlock,
          page,
          limit,
          fromTimestamp,
          toTimestamp,
        },
      }),
    }),
  }),
});

export const { useGetTransactionsQuery } = tokensApi;

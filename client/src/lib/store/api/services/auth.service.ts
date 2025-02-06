import { baseApi } from "../baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    loginOrRegister: build.mutation<
      { accessToken: string },
      { address: string; nonce: string; signature: string }
    >({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getNonce: build.mutation<{ nonce: string }, string>({
      query: (address: string) => ({
        url: "auth/nonce",
        method: "POST",
        body: { address },
      }),
    }),
    logout: build.mutation<{ message: string }, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginOrRegisterMutation,
  useGetNonceMutation,
  useLogoutMutation,
} = authApi;

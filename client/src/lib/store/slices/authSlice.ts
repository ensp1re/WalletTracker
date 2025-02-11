import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type NetworkType = "eth-mainnet" | "eth-sepolia";

export interface AuthState {
  address: string | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isConnecting: boolean;
  network?: NetworkType;
  queryAddress?: string | null;
  isSignedMessage?: boolean;
}

const initialState: AuthState = {
  address: null,
  accessToken: null,
  isAuthenticated: false,
  isConnecting: false,
  network: "eth-mainnet",
  queryAddress: null,
  isSignedMessage: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        address: string;
        accessToken: string;
      }>
    ) => {
      state.address = action.payload.address;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.address = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isSignedMessage = false;
    },
    setConnecting: (state, action: PayloadAction<boolean>) => {
      state.isConnecting = action.payload;
    },
    setNetwork: (state, action: PayloadAction<NetworkType>) => {
      state.network = action.payload;
    },
    setQueryAddress: (state, action: PayloadAction<string>) => {
      state.queryAddress = action.payload;
    },
    setSignedMessage: (state, action: PayloadAction<boolean>) => {
      state.isSignedMessage = action.payload;
    },
  },
});

export const {
  setCredentials,
  logout,
  setConnecting,
  setNetwork,
  setSignedMessage,
} = authSlice.actions;
export default authSlice.reducer;

import { useCallback } from "react";
import { Eip1193Provider, ethers } from "ethers";
import {
  useLogoutMutation,
  useLoginOrRegisterMutation,
  useGetNonceMutation,
} from "../lib/store/api/services/auth.service";
import {
  setCredentials,
  logout,
  setConnecting,
  setNetwork,
  NetworkType,
  setSignedMessage,
} from "../lib//store/slices/authSlice";
import {
  useAppDispatch,
  useAppSelector,
  type RootState,
} from "../lib/store/store";
import toast from "react-hot-toast";
import {
  useAppKitAccount,
  useAppKitProvider,
  useDisconnect,
} from "@reown/appkit/react";
import { modal } from "@/context/ContextWalletProvider";
import {} from "@reown/appkit/networks";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { address, isAuthenticated, isConnecting, network, queryAddress } =
    useAppSelector((state: RootState) => state.auth);

  const { walletProvider } = useAppKitProvider<Eip1193Provider>("eip155");


  const { disconnect } = useDisconnect();
  const { isConnected } = useAppKitAccount();


  const [loginOrRegister] = useLoginOrRegisterMutation();
  const [logoutMutation] = useLogoutMutation();
  const [getNonce] = useGetNonceMutation();


  const connectWallet = useCallback(async () => {
    dispatch(setConnecting(true));
    try {
      if (!isConnected) {
        await modal.open();
      }

      const provider = new ethers.BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();

      const data = (await getNonce(
        walletAddress as string
      ).unwrap()) as unknown as {
        nonce: string;
      };

      const nonce: string = data.nonce as string;

      if (!nonce) {
        throw new Error("Failed to get nonce");
      }

      const message = `Login to DApp with nonce: ${nonce}`;
      const signature = await signer.signMessage(message);
      dispatch(setSignedMessage(true));
      const getNetwork = await provider.getNetwork();

      const result = await loginOrRegister({
        address: walletAddress,
        nonce,
        signature,
      }).unwrap();

      let network: string | undefined;

      if (getNetwork.name === "mainnet") {
        network = "eth-mainnet";
      } else if (getNetwork.name === "sepolia") {
        network = "eth-sepolia";
      } else {
        console.error("Invalid network");
      }

      if (!network) {
        throw new Error("Network is not supported");
      }

      dispatch(setNetwork(network as NetworkType));
      dispatch(
        setCredentials({
          address: walletAddress,
          accessToken: result.accessToken,
        })
      );

      return true;
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Error connecting wallet");
      return false;
    } finally {
      dispatch(setConnecting(false));
    }
  }, [
    address,
    dispatch,
    getNonce,
    isAuthenticated,
    loginOrRegister,
    open,
    walletProvider,
  ]);

  const disconnectWallet = useCallback(async () => {
    try {
      await logoutMutation().unwrap();
      await disconnect();
      dispatch(logout());
      return true;
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast.error("Error disconnecting wallet");
      return false;
    }
  }, [logoutMutation, disconnect, dispatch]);

  return {
    address,
    isAuthenticated,
    isConnecting,
    connectWallet,
    disconnectWallet,
    network,
    queryAddress,
  };
};

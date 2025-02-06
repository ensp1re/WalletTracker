import { useCallback } from "react";
import { ethers } from "ethers";
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
} from "../lib//store/slices/authSlice";
import {
  useAppDispatch,
  useAppSelector,
  type RootState,
} from "../lib/store/store";
import toast from "react-hot-toast";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { address, isAuthenticated, isConnecting, network, queryAddress } =
    useAppSelector((state: RootState) => state.auth);

  const [loginOrRegister] = useLoginOrRegisterMutation();
  const [logoutMutation] = useLogoutMutation();
  const [getNonce] = useGetNonceMutation();

  const changeNetwork = useCallback(
    async (network: NetworkType) => {
      if (typeof window.ethereum !== "undefined") {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [
              {
                chainId:
                  network === "eth-mainnet"
                    ? "0x1"
                    : network === "eth-sepolia"
                    ? "0xaa36a7"
                    : "0x0",
              },
            ],
          });
          dispatch(setNetwork(network));
          toast.success(`Switched to ${network}`);
        } catch (error) {
          console.error("Error switching network:", error);
          toast.error("Error switching network");
        }
      }
    },
    [dispatch]
  );

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum !== "undefined") {
      dispatch(setConnecting(true));
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        const data = (await getNonce(
          address as string
        ).unwrap()) as unknown as { nonce: string };

        const nonce: string = data.nonce as string;

        if (!nonce) {
          throw new Error("Failed to get nonce");
        }

        const message = `Login to DApp with nonce: ${nonce}`;
        const signature = await signer.signMessage(message);
        const getNetwork = await provider.getNetwork();

        const result = await loginOrRegister({
          address,
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
        dispatch(setCredentials({ address, accessToken: result.accessToken }));

        return true;
      } catch (error) {
        console.error("Error connecting wallet:", error);
        toast.error("Error connecting wallet");
        return false;
      } finally {
        dispatch(setConnecting(false));
      }
    }
    return false;
  }, [dispatch, getNonce, loginOrRegister]);

  const disconnectWallet = useCallback(async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(logout());
      return true;
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast.error("Error disconnecting wallet");
      return false;
    }
  }, [logoutMutation, dispatch]);

  return {
    address,
    isAuthenticated,
    isConnecting,
    connectWallet,
    disconnectWallet,
    network,
    queryAddress,
    changeNetwork,
  };
};

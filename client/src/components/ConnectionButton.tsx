import { useTranslation } from "react-i18next"
import { FaSpinner } from "react-icons/fa"
import { useAuth } from "@/hooks/useAuth"
import { RootState, useAppSelector } from "@/lib/store/store"
import { useAppKitAccount } from "@reown/appkit/react"

export default function ConnectButton() {
  const {
    connectWallet,
    disconnectWallet,
    isAuthenticated,
    address,
    isConnecting,
  } = useAuth()

  const { t } = useTranslation()

  const isMessageSigned = useAppSelector((state: RootState) => state.auth.isSignedMessage);
  const {
    isConnected,
  } = useAppKitAccount();

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={!isAuthenticated ? connectWallet : disconnectWallet}
        disabled={isConnecting}
        className={`
          px-4 py-2 rounded-lg font-medium transition-all
          ${address ? "bg-gray-100 hover:bg-gray-200 text-gray-800" : "bg-emerald-600 hover:bg-emerald-700 text-white"}
          ${isConnecting && "opacity-75 cursor-not-allowed"}
        `}
      >

        {isConnecting ? (
          <div className="flex items-center gap-2">
            <FaSpinner className="animate-spin h-4 w-4" />
          </div>
        ) : address && isMessageSigned ? (
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-emerald-500 rounded-full" />
            {`${address.slice(0, 6)}...${address.slice(-4)}`}
          </div>
        ) : isConnected && !isMessageSigned ? (
          <span>Sign Message</span>
        ) : (
          !isConnected && !isMessageSigned && t("connectWallet")
        )}
      </button>
    </div>
  )
}


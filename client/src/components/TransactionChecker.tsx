import { RootState } from "@/lib/store/store";
import { Transaction } from "@covalenthq/client-sdk";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";




const WEBSOCKET_URL = process.env.PUBLIC_BACKEND_URL as string || 'http://localhost:4000';



const TransactionChecker: React.FC = () => {
    const { accessToken, address } = useSelector((state: RootState) => state.auth)
    const network = useSelector((state: RootState) => state.auth.network)

    useEffect(() => {
        if (!accessToken || !address || !network) return

        const newSocket = io(WEBSOCKET_URL, {
            auth: { token: accessToken, address, network },
            withCredentials: true,
        })

        newSocket.on("connect", () => {
            console.log("Connected to WebSocket server")
            newSocket.emit("checkTransactions", { address, network })
        })

        newSocket.on("disconnect", () => {
            console.log("Disconnected from WebSocket server")
        })

        newSocket.on("newTransactions", (newTransactions: Transaction[]) => {
            newTransactions.forEach((tx: Transaction, index) => {
                setTimeout(() => {
                    toast.custom((t) => (
                        <div
                            className={`${t.visible ? 'animate-enter' : 'animate-leave'
                                } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                        >
                            <div className="flex-1 w-0 p-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 pt-0.5">
                                        <img
                                            className="h-10 w-10 rounded-full"
                                            src="/path/to/your/icon.png"
                                            alt=""
                                        />
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <p className="text-sm font-medium text-gray-900">
                                            New Transaction
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500">
                                            <a href={`https://etherscan.io/tx/${tx.tx_hash}`} target="_blank" rel="noopener noreferrer">
                                                {tx.tx_hash ? `${tx.tx_hash.slice(0, 6)}...${tx.tx_hash.slice(-4)}` : 'N/A'}
                                            </a> - Value: {tx.value?.toString()} - From:{" "}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex border-l border-gray-200">
                                <button
                                    onClick={() => toast.dismiss(t.id)}
                                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    ), {
                        position: "top-right",
                        duration: 5000,
                    })
                }, index * 1000)
            })
        })
        return () => {
            newSocket.disconnect()
        }
    }, [accessToken, address, network])


    return null;
}

export default TransactionChecker;


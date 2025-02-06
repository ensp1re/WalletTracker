/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { ethers } from "ethers"
import toast from "react-hot-toast"

interface Web3ContextType {
    account: string | null
    chainId: number | null
    connect: () => Promise<void>
    disconnect: () => void
    isConnecting: boolean
    error: string | null
    sidebarOpen: boolean
    onSidebarOpen: () => void
}

const Web3Context = createContext<Web3ContextType | null>(null)

export function Web3Provider({ children }: { children: ReactNode }) {
    const [account, setAccount] = useState<string | null>(null)
    const [chainId, setChainId] = useState<number | null>(null)
    const [isConnecting, setIsConnecting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        const checkConnection = async () => {
            if (typeof window.ethereum !== "undefined") {
                try {
                    const provider = new ethers.BrowserProvider(window.ethereum)
                    const accounts = await provider.listAccounts()
                    if (accounts.length > 0 && accounts) {
                        setAccount(await accounts[0].getAddress())
                        const network = await provider.getNetwork()
                        setChainId(network.chainId as unknown as number)
                    }
                } catch (err) {
                    console.error("Error checking connection:", err)
                }
            }
        }

        checkConnection()

        if (typeof window.ethereum !== "undefined") {
            window.ethereum.on("accountsChanged", (accounts: string[]) => {
                setAccount(accounts[0] || null)
            })

            window.ethereum.on("chainChanged", (chainId: string) => {
                setChainId(Number.parseInt(chainId))
            })

            window.ethereum.on("disconnect", () => {
                setAccount(null)
                setChainId(null)
            })
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeAllListeners()
            }
        }
    }, [])

    const connect = async () => {
        if (typeof window.ethereum === "undefined") {
            toast.error("Metamask not installed")
            return
        }

        setIsConnecting(true)
        setError(null)

        try {
            const provider = new ethers.BrowserProvider(window.ethereum)
            const accounts = await provider.listAccounts()
            const network = await provider.getNetwork()

            setAccount(await accounts[0].getAddress())
            setChainId(network.chainId as unknown as number)
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setIsConnecting(false)
        }
    }

    const disconnect = () => {
        setAccount(null)
        setChainId(null)
    }

    const onSidebarOpen = () => {
        setSidebarOpen((prev) => !prev)
    };

    return (
        <Web3Context.Provider
            value={{
                account,
                chainId,
                connect,
                disconnect,
                isConnecting,
                error,
                sidebarOpen,
                onSidebarOpen
            }}
        >
            {children}
        </Web3Context.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWeb3() {
    const context = useContext(Web3Context)
    if (!context) {
        throw new Error("useWeb3 must be used within a Web3Provider")
    }
    return context
}


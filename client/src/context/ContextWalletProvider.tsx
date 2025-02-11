import type React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type Config, WagmiProvider, cookieToInitialState } from "wagmi"
import { createAppKit } from '@reown/appkit/react';
import { mainnet, sepolia } from "@reown/appkit/networks"
import { projectId, wagmiAdapter } from "../config"

const queryClient = new QueryClient()

if (!projectId) {
    throw new Error("Missing PUBLIC_PROJECT_ID")
}

// eslint-disable-next-line react-refresh/only-export-components
export const modal = createAppKit({
    adapters: [wagmiAdapter],
    networks: [mainnet, sepolia],
    projectId,
    defaultNetwork: mainnet,
    features: {
        analytics: true,
        email: false,
        socials: false,
    },
    themeMode: "dark",
})

interface ContextProviderProps {
    children: React.ReactNode
    cookies: string | null
}

function ContextProvider({ children, cookies }: ContextProviderProps) {
    const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    )
}

export default ContextProvider


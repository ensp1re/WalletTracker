import { WagmiAdapter } from "@reown/appkit-adapter-wagmi"
import { cookieStorage, createStorage } from "wagmi"
import { AppKitNetwork, mainnet, sepolia } from "@reown/appkit/networks"

export const projectId = process.env.PUBLIC_PROJECT_ID || "dscdfsdf-sdfsd-sdfsd-sdfsd-sdfsd"

if (!projectId) {
    throw new Error("Missing PUBLIC_PROJECT_ID")
}

export const networks = [mainnet, sepolia] as [AppKitNetwork, ...AppKitNetwork[]]

export const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
        storage: cookieStorage,
    }),
    networks,
    projectId,
})

export const config = wagmiAdapter.wagmiConfig;


import { Search, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import ConnectButton from "./ConnectionButton"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCallback, useEffect, useState } from "react"
import { Sidebar } from "./sidebar"
import { checkIfCorrectAddress } from "@/lib/utils"
import toast from "react-hot-toast"
import { useAppKitNetwork, useAppKitProvider } from "@reown/appkit/react"
import { Eip1193Provider, ethers } from "ethers"
import { useAppDispatch } from "@/lib/store/store"
import { setNetwork } from "@/lib/store/slices/authSlice"
// import { useAuth } from "@/hooks/useAuth"

export function Header() {
    const [open, setOpen] = useState<boolean>(false);
    const [ntw, setNtw] = useState<string>("Ethereum");
    const { walletProvider } = useAppKitProvider<Eip1193Provider>("eip155");

    const dispatch = useAppDispatch();

    const changeNetwork = useCallback(async (network: string) => {
        try {
            const provider = new ethers.BrowserProvider(walletProvider);
            await provider.send("wallet_switchEthereumChain", [{ chainId: network }]);
        } catch (error) {
            console.error("Failed to switch network", error);
        }
    }, [walletProvider]);

    const {
        caipNetwork,
        chainId
    } = useAppKitNetwork();


    useEffect(() => {
        setNtw(caipNetwork?.name || "Ethereum");
        changeNetwork("chainId")

    }, [caipNetwork, chainId, changeNetwork])

    useEffect(() => {
        if (ntw === "Ethereum") {
            dispatch(setNetwork("eth-mainnet"));
        } else if (ntw === "Sepolia") {
            dispatch(setNetwork("eth-sepolia"));
        } else (
            setNtw("Ethereum")
        )
    }, [dispatch, ntw])



    return (
        <header className="h-16 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="flex items-center justify-between h-full px-4 sm:px-6">
                <div className="flex items-center flex-1 gap-4">
                    {/* Mobile Menu Button */}
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="lg:hidden">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 m-0 h-full w-64 overflow-auto">
                            <Sidebar mobile />
                        </SheetContent>
                    </Sheet>

                    {/* Search Input */}
                    <div className="relative flex-1 max-w-full sm:max-w-96 mr-2">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input
                            placeholder="Search address / memo / Web3 ID"
                            className="pl-9 bg-gray-50 border-gray-200"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const input = e.target as HTMLInputElement;

                                    if (checkIfCorrectAddress(input.value)) {
                                        window.location.href = `?address=${input.value}`;
                                    } else {
                                        toast.error("Invalid address");
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Right Side */}
                <div className=" items-center gap-4 flex">
                    <appkit-network-button />
                    <ConnectButton />
                </div>
            </div>
        </header>
    )
}
import { Search, ChevronDown, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import ConnectButton from "./ConnectionButton"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useEffect, useState } from "react"
import { Sidebar } from "./sidebar"
import { checkIfCorrectAddress } from "@/lib/utils"
import toast from "react-hot-toast"
import { useAuth } from "@/hooks/useAuth"

export function Header() {
    const [open, setOpen] = useState<boolean>(false);
    const [ntw, setNtw] = useState<string>("Ethereum");



    const {
        changeNetwork,
        network
    } = useAuth();

    useEffect(() => {
        if (network === "eth-mainnet") {
            setNtw("Ethereum");
        } else if (network === "eth-sepolia") {
            setNtw("Sepolia");
        } else (
            setNtw("Wrong Network")
        )
    }, [network])



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
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2 hidden md:flex">
                                {
                                    ntw
                                }
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => changeNetwork("eth-mainnet")} className="cursor-pointer">Ethereum</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => changeNetwork("eth-sepolia")} className="cursor-pointer">Sepolia</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <ConnectButton />
                </div>
            </div>
        </header>
    )
}
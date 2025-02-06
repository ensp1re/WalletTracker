// import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, ExternalLink } from "lucide-react"
import LightWaveLoading from "./LightWaveLoading"

interface ProfileCardProps {
    address: string
    balance: number
    change: string
    loading?: boolean
}

export function ProfileCard({ address, balance, change, loading }: ProfileCardProps) {
    return (
        <Card className="bg-gradient-to-br from-emerald-50 via-white to-white border-emerald-100">
            {loading ? <LightWaveLoading className="w-full min-h-32" /> : (
                <CardContent className="p-6">

                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img
                                    alt="Profile"
                                    className="rounded-full"
                                    height={80}
                                    width={80}
                                    src="/placeholder.svg"
                                />
                                {/* <Badge variant="secondary" className="absolute -top-2 -right-2 bg-emerald-100 text-emerald-700">
                                            VIP
                                        </Badge> */}
                            </div>
                            <div>
                                <Button variant="outline" size="sm" className="mt-2 text-emerald-600 border-emerald-600 hover:bg-emerald-50">
                                    Buy Username
                                </Button>
                                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                    <span className="font-mono">{address}</span>
                                    <Button variant="ghost" size="icon" className="h-4 w-4">
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-4 w-4">
                                        <ExternalLink className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex  gap-2 justify-center self-center flex-col text-right">
                            <div className="text-xl md:text-2xl font-bold">${balance}</div>
                            <div className={`font-medium ${parseFloat(change) > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                {change}
                            </div>
                        </div>
                    </div>

                </CardContent>
            )}
        </Card>
    )


}


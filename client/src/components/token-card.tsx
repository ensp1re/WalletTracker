import { Card, CardContent } from "@/components/ui/card"
import LightWaveLoading from "./LightWaveLoading"

interface TokenCardProps {
    name: string
    symbol?: string
    balance: string
    value?: string
    change: number
    icon: string
    isLoading?: boolean
}

export function TokenCard({ name, balance, change, icon, isLoading }: TokenCardProps) {
    return (
        <Card className="hover:bg-gray-50 transition-colors">
            {isLoading ? <LightWaveLoading className="px-20 py-8" /> : (

                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <img src={icon || "/placeholder.svg"} alt={name} className="h-8 w-8 rounded-full" />
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">{name}</h3>
                            </div>
                            <div className="flex items-center justify-between mt-1 gap-2">
                                <span className="text-sm text-gray-600">{balance}</span>
                                <div className="text-right">
                                    <div className={`text-xs ${change >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                                        {
                                            change ? `${change}%` : ''
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </CardContent>
            )}
        </Card>
    )
}


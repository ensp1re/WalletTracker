import { Card } from "@/components/ui/card"

interface NFTCardProps {
    name: string
    symbol: string
    network: string
    token_contract: string
    image: string
}

export function NFTCard({ name, symbol, network, token_contract, image }: NFTCardProps) {
    return (
        <Card className="overflow-hidden rounded-xl border border-border/40 hover:border-border/80 transition-colors">
            <div className="relative aspect-square w-full">
                <img src={image || "/placeholder.svg"} alt={name} className="object-cover w-full h-full" />
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-lg">{name}</h3>
                <p className="text-sm text-muted-foreground">{symbol}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="bg-secondary px-2 py-1 rounded-md text-secondary-foreground">{network}</span>
                    <span className="text-muted-foreground font-mono">
                        {token_contract.slice(0, 6)}...{token_contract.slice(-4)}
                    </span>
                </div>
            </div>
        </Card>
    )
}

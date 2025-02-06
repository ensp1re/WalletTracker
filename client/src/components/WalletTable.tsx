import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { formatNumber } from "@/utils/format"
import { useTranslation } from "react-i18next"
import { Button } from "./ui/button"
import LightWaveLoading from "./LightWaveLoading"
import { v4 as uuidv4 } from "uuid"

export interface Token {
    symbol: string
    icon: string
    price: number
    amount: number
    usdValue: number
    network?: string
    token_contract?: string
}

interface WalletTableProps {
    tokens: Token[]
    totalValue: number
    loading?: boolean
}

export default function WalletTable({ tokens, totalValue, loading }: WalletTableProps) {
    const [activeTab, setActiveTab] = useState("Default")
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [tokensOr, setTokensOr] = useState<Token[]>(tokens)

    useEffect(() => {
        if (activeTab === "Default") {
            setTokensOr(tokens)
        } else if (activeTab === "Name") {
            setTokensOr([...tokens].sort((a, b) => a.symbol.localeCompare(b.symbol)))
        } else if (activeTab === "High") {
            setTokensOr([...tokens].sort((a, b) => b.usdValue - a.usdValue))
        } else if (activeTab === "Low") {
            setTokensOr([...tokens].sort((a, b) => a.usdValue - b.usdValue))
        }
    }, [activeTab, tokens])

    const handleTokenClick = (symbol: string, token_contract: string) => {
        navigate(`/price?token=${symbol}&token_contract=${token_contract}`)
    }

    return (
        <div className="bg-white rounded-lg shadow">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-pink-100 rounded-lg">
                        <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6h18M3 12h18M3 18h18" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold">Wallet</h2>
                </div>
                <div className="text-xl font-bold">${formatNumber(totalValue)}</div>
            </div>

            {/* Tabs */}
            <div className="flex justify-center md:justify-start flex-wrap gap-2 p-4 border-b">
                {["Default", "Name", "High", "Low"].map((tab) => (
                    <Button
                        variant={activeTab === tab ? "default" : "ghost"}
                        key={uuidv4()}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                            ${activeTab === tab ? "bg-gray-700 text-white" : "text-gray-500 hover:bg-gray-100"}`}
                    >
                        {t(`walletTable.tabs.${tab.toLowerCase()}`)}
                    </Button>
                ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">

                {
                    loading ? (
                        <LightWaveLoading className="w-full min-h-32" />
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t("walletTable.token")}</th>
                                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">{t("walletTable.price")}</th>
                                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">{t("walletTable.amount")}</th>
                                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">{t("walletTable.usdValue")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {tokensOr.map((token: Token) => (
                                    <tr
                                        key={uuidv4()}
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={() => handleTokenClick(token.symbol, token.token_contract!)}
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                                                    <img
                                                        src={token.icon || "/placeholder.svg"}
                                                        alt={token.symbol}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="font-medium">{token.symbol}</span>
                                                    {token.network && <span className="text-xs text-gray-500">{token.network}</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right font-medium">${formatNumber(token.price)}</td>
                                        <td className="px-4 py-3 text-right font-mono">{formatNumber(token.amount)}</td>
                                        <td className="px-4 py-3 text-right font-medium">${formatNumber(token.usdValue)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                }

            </div>
        </div>
    )
}


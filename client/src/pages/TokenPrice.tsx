import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { FaSpinner } from "react-icons/fa"
import { PriceChartWidget } from "@/components/WidgetPrice"
import { useAuth } from "@/hooks/useAuth"

interface TokenData {
    token_contract: string
    symbol: string
}

// const mockChartData = [
//     { date: "2023-01-01", price: 100 },
//     { date: "2023-02-01", price: 120 },
//     { date: "2023-03-01", price: 110 },
//     { date: "2023-04-01", price: 140 },
//     { date: "2023-05-01", price: 130 },
//     { date: "2023-06-01", price: 160 },
// ]

export default function TokenPrice() {
    const [searchParams] = useSearchParams()
    const [tokenData, setTokenData] = useState<TokenData | null>(null)
    const { t } = useTranslation()


    const {
        network
    } = useAuth()


    useEffect(() => {
        const fetchTokenData = async () => {
            // In a real app, you would fetch this data from an API
            // For now, we'll just simulate a delay and return mock data
            await new Promise((resolve) => setTimeout(resolve, 500))
            setTokenData({
                token_contract: searchParams.get("token_contract") || "UNKNOWN",
                symbol: searchParams.get("token") || "UNKNOWN",
            })
        }

        fetchTokenData()
    }, [searchParams])

    if (!tokenData) {
        return (
            <div className="flex justify-center items-center h-full">
                <FaSpinner className="animate-spin h-6 w-6" />
            </div>
        )
    }

    return (
        <div className={`p-4 ${!searchParams.get("token") ? "h-full" : ""} h-full`}>
            {network === "eth-sepolia" ? (
                <div className="flex flex-col items-center justify-center h-full p-6 rounded-lg shadow-lg">
                    <h1 className="text-4xl font-extrabold text-red-600 mb-6">{t("tokenPrice.networkProhibited")}</h1>
                    <p className="text-lg text-red-500">{t("tokenPrice.networkProhibitedMessage")}</p>
                </div>
            ) : !searchParams.get("token_contract") ? (
                <div className="flex flex-col items-center justify-center h-full">
                    <h1 className="text-3xl font-bold mb-6">{t("tokenPrice.enterToken")}</h1>
                    <input
                        type="text"
                        placeholder={t("tokenPrice.tokenPlaceholder")}
                        className="p-3 border rounded-lg mb-4 w-64 text-center shadow-md"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                const token = (e.target as HTMLInputElement).value
                                if (token) {
                                    window.location.search = `?token_contract=${token}`
                                }
                            }
                        }}
                    />
                </div>
            ) : (
                <div className="flex h-full p-3 flex-col gap-4 mb-4">
                    <h1 className="text-2xl font-bold mb-4">
                        {tokenData.symbol}
                    </h1>
                    <div className="md:col-span-5 h-full bg-white p-4 mb-4 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">{t("tokenPrice.priceChart")}</h2>
                        <PriceChartWidget address={tokenData.token_contract} />
                    </div>
                </div>
            )}
        </div>
    )
}


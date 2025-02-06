import { useState } from "react"
import { formatDistanceToNow } from "date-fns"

interface Transaction {
    id: string
    timestamp: Date
    hash: string
    type: string
    tokens: {
        symbol: string
        amount: string
        value: string
        icon: string
    }[]
    gasFee: {
        amount: string
        value: string
    }
}

interface TransactionsProps {
    transactions: Transaction[]
}

export default function Transactions({ transactions }: TransactionsProps) {
    const [filter, setFilter] = useState("all")

    return (
        <div className="bg-white rounded-lg border">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Recent Transactions</h2>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-1.5 text-sm border rounded-lg bg-gray-50"
                >
                    <option value="all">All Transactions</option>
                    <option value="in">Incoming</option>
                    <option value="out">Outgoing</option>
                </select>
            </div>

            {/* Transactions List */}
            <div className="divide-y">
                {transactions.map((tx) => (
                    <div key={tx.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-500">{formatDistanceToNow(tx.timestamp)} ago</span>
                                <div className="flex items-center gap-1">
                                    <span className="text-sm font-mono text-gray-600">
                                        {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                                    </span>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="text-sm text-gray-500">
                                Gas Fee {tx.gasFee.amount} (~${tx.gasFee.value})
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium">{tx.type}</span>
                            </div>

                            <div className="flex flex-col items-end gap-1">
                                {tx.tokens.map((token, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <img src={token.icon || "/placeholder.svg"} alt={token.symbol} className="w-5 h-5 rounded-full" />
                                        <span className="text-sm text-emerald-600">
                                            +{token.amount} {token.symbol} (${token.value})
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}


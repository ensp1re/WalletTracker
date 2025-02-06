import { formatDistanceToNow } from "date-fns"
import { ClipboardCopy, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { Pagination } from "./Pagination"

export interface Transaction {
    block_signed_at: string
    tx_hash: string
    from_address: string
    to_address: string
    value: string
    fees_paid: string
    gas_quote: number
    gas_quote_rate: number
}

interface TransactionListProps {
    transactions: Transaction[]
    page: number
    setPage: (page: number) => void
    itemsPerPage?: number
    addressToCheck: string // Added addressToCheck prop
    totalItems: number
}

export default function TransactionList({
    transactions,
    page,
    setPage,
    itemsPerPage = 10,
    addressToCheck = "", // Added default value for addressToCheck
    totalItems,
}: TransactionListProps) {
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (page - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentTransactions = transactions.slice(startIndex, endIndex)

    return (
        <div className="flex flex-col space-y-4">
            {currentTransactions.map((tx) => (
                <div
                    key={tx.tx_hash}
                    className="flex flex-col space-y-2 p-4 bg-card rounded-lg border shadow-sm hover:shadow-md transition-all"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-muted-foreground">
                                {formatDistanceToNow(new Date(tx.block_signed_at))} ago
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="text-sm font-mono text-muted-foreground">
                                    {tx.tx_hash.slice(0, 6)}...{tx.tx_hash.slice(-4)}
                                </div>
                                <button
                                    onClick={() => navigator.clipboard.writeText(tx.tx_hash)}
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <ClipboardCopy className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Gas Fee {(Number(tx.fees_paid) / 1e18).toFixed(8)} ETH (~${tx.gas_quote.toFixed(2)})
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                        <div className="flex items-center space-x-2">
                            {tx.from_address.toLowerCase() === tx.to_address.toLowerCase() ? (
                                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <ArrowUpRight className="h-4 w-4 text-yellow-600" />
                                </div>
                            ) : tx.from_address.toLowerCase() === addressToCheck.toLowerCase() ? (
                                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                    <ArrowUpRight className="h-4 w-4 text-red-600" />
                                </div>
                            ) : (
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <ArrowDownLeft className="h-4 w-4 text-green-600" />
                                </div>
                            )}
                            <span className="text-sm font-medium">
                                {tx.from_address.toLowerCase() === tx.to_address.toLowerCase()
                                    ? "Self Transfer"
                                    : tx.from_address.toLowerCase() === addressToCheck.toLowerCase()
                                        ? "Sent"
                                        : "Received"}
                            </span>
                        </div>

                        <div className="flex items-center justify-end space-x-2">
                            <span
                                className={`text-sm ${tx.from_address.toLowerCase() === addressToCheck.toLowerCase() ? "text-red-600" : "text-green-600"
                                    }`}
                            >
                                {tx.from_address.toLowerCase() === addressToCheck.toLowerCase() ? "-" : "+"}
                                {(Number(tx.value) / 1e18).toFixed(8)} ETH
                            </span>
                            <span className="text-sm text-muted-foreground">
                                (${((Number(tx.value) / 1e18) * tx.gas_quote_rate).toFixed(2)})
                            </span>
                        </div>
                    </div>
                </div>
            ))}

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    )
}


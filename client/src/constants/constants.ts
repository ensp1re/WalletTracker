import { Transaction } from "@/components/TransactionList"

export const mockTransactions: Transaction[] = [{
    id: "1",
    timestamp: new Date(Date.now() - 17 * 60 * 60 * 1000 - 29 * 60 * 1000),
    hash: "0x1d92...4c30",
    type: "claimAvailableAlchemica",
    tokens: [
        {
            symbol: "FUD",
            amount: "777.6",
            value: "0.06",
            icon: "/placeholder.svg?height=20&width=20",
        },
        {
            symbol: "FOMO",
            amount: "379.2",
            value: "0.06",
            icon: "/placeholder.svg?height=20&width=20",
        },
        {
            symbol: "ALPHA",
            amount: "224.64",
            value: "0.06",
            icon: "/placeholder.svg?height=20&width=20",
        },
        {
            symbol: "KEK",
            amount: "63.96",
            value: "0.05",
            icon: "/placeholder.svg?height=20&width=20",
        },
    ],
    gasFee: {
        amount: "0.0132POL",
        value: "0.01",
    },
},
]

export const mockTokens = [
    {
        symbol: "S",
        icon: "/placeholder.svg?height=32&width=32",
        price: 0.5264,
        amount: 15508.572,
        usdValue: 8163.71,
    },
    {
        symbol: "ETH",
        icon: "/placeholder.svg?height=32&width=32",
        price: 3265.91,
        amount: 2.2909,
        usdValue: 7481.85,
    },
    {
        symbol: "GHST",
        icon: "/placeholder.svg?height=32&width=32",
        price: 0.769,
        amount: 8468.6746,
        usdValue: 6512.41,
    },
    {
        symbol: "LINK",
        icon: "/placeholder.svg?height=32&width=32",
        price: 24.7652,
        amount: 139.3132,
        usdValue: 3450.11,
    },
    {
        symbol: "UNI",
        icon: "/placeholder.svg?height=32&width=32",
        price: 12.1202,
        amount: 188.8606,
        usdValue: 2289.03,
    },
    {
        symbol: "ETH",
        icon: "/placeholder.svg?height=32&width=32",
        price: 3265.91,
        amount: 0.5301,
        usdValue: 1731.27,
        network: "wstETH",
    },
]

export const totalValue = mockTokens.reduce((sum, token) => sum + token.usdValue, 0)

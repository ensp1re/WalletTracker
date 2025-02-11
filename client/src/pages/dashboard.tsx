/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useCallback, useEffect, useState } from "react"
import { ErrorAlert } from "@/components/error-alert"
import { ProfileCard } from "@/components/profile-card"
// import { TokenCard } from "@/components/token-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TransactionList from "@/components/TransactionList"
import WalletTable, { Token } from "@/components/WalletTable"
import { TokenCard } from "@/components/token-card"
import { useGetNftBalanceQuery, useGetTokensQuery } from "@/lib/store/api/services/tokens.service"
import { useAuth } from "@/hooks/useAuth"
import { checkIfCorrectAddress, shortenAddress } from "@/lib/utils"
import { BalanceItem, NftTokenContractBalanceItem } from "@covalenthq/client-sdk"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useSearchParams } from "react-router-dom"
import toast from "react-hot-toast"
import { v4 as uuidV4 } from "uuid"
import { useTranslation } from "react-i18next"
import { NFTCard } from "@/components/NftCard"
import { useGetTransactionsQuery } from "@/lib/store/api/services/transactions.service"
import { Transaction as tSdk } from "@covalenthq/client-sdk";
import { Transaction } from "@/components/TransactionList"


export default function Dashboard() {
    const [error, setError] = useState<string | null>(null);
    const [tokens, setTokens] = useState<Token[] | null>(null);
    const [totalBalance, setTotalBalance] = useState<number>(0);
    const [totalChange, setTotalChange] = useState<number>(0);
    const [addressToCheck, setAddressToCheck] = useState<string | null>(null);
    const [nfts, setNfts] = useState<tSdk[]>([]);
    const [transactionData, setTransactionData] = useState<Transaction[]>([]);
    const [totalItems, setTotalItems] = useState<number>(0);

    const { t } = useTranslation();

    const [searchParams] = useSearchParams();
    const queryAddress = searchParams.get("address");

    const {
        address,
        network,
    } = useAuth();

    useEffect(() => {
        if (queryAddress) {
            setAddressToCheck(queryAddress);
        } else {
            setAddressToCheck(address);
        }
    }, [address, queryAddress])


    const calculateTotalChangeInPercent = (tokens: BalanceItem[]) => {
        if (!tokens || tokens.length === 0) return "0";

        const totalQuote = tokens.reduce((acc, token) => acc + (token.quote ?? 0), 0);
        const totalQuote24h = tokens.reduce((acc, token) => acc + (token.quote_24h ?? 0), 0);

        const change = ((totalQuote - totalQuote24h) / totalQuote24h) * 100;
        return change.toFixed(2).toString();
    };

    const cryptoBalanceToNormal = (balance: number, decimals: number) => {
        return (balance / Math.pow(10, decimals)).toFixed(5);
    };

    const { data: tokensData, isLoading: isTokenLoading } = useGetTokensQuery({ address: addressToCheck as string, network: network }, {
        skip: !addressToCheck
    });

    const { data: nftsData, isLoading: isNftLoading } = useGetNftBalanceQuery({ address: addressToCheck as string, network: network }, {
        skip: !addressToCheck
    })

    const [page, setPage] = useState<number>(1);


    const { data: transactionsData, isLoading: isTransactionLoading } = useGetTransactionsQuery({ address: addressToCheck as string, network: network, page }, {
        skip: !addressToCheck
    });


    const toBeautifulData = useCallback(async (token: BalanceItem): Promise<Token> => {
        return {
            symbol: token.contract_ticker_symbol?.toUpperCase() as string,
            icon: token.logo_url && await checkUrlResponse(token.logo_url) ? token.logo_url : "/placeholder.svg",
            price: token.quote_rate ?? 0,
            amount: parseFloat(cryptoBalanceToNormal(Number(token.balance ?? 0), token.contract_decimals ?? 18)),
            usdValue: token.quote ?? 0,
            network: network as string === "eth-mainnet" ? "Ethereum" : "Sepolia",
            token_contract: token.contract_address as string,
        }
    }, [network]);

    const toBeautifulNftData = useCallback(async (nft: NftTokenContractBalanceItem): Promise<any | null> => {
        return {
            name: nft.contract_name,
            symbol: nft.contract_ticker_symbol,
            network: network as string === "eth-mainnet" ? "Ethereum" : "Sepolia",
            token_contract: nft.contract_address,
            image: nft.nft_data && nft.nft_data[0] ? nft.nft_data[0].external_data?.image_256 : "/placeholder.svg"
        }
    }, [network]);


    const toBeautifulTransactionData = useCallback(async (transaction: tSdk): Promise<Transaction> => {
        return {
            tx_hash: transaction.tx_hash ?? "",
            block_signed_at: transaction.block_signed_at?.toString() ?? "",
            from_address: transaction.from_address ?? "",
            to_address: transaction.to_address ?? "",
            value: transaction.value?.toString() ?? "",
            fees_paid: transaction.fees_paid?.toString() ?? "",
            gas_quote: transaction.gas_quote ?? 0,
            gas_quote_rate: transaction.gas_quote_rate ?? 0
        }
    }, []);


    useEffect(() => {
        if (tokensData) {

            const fetchData = async () => {

                const filteredData = tokensData.tokens.filter((token: BalanceItem) => {
                    return token.type !== "dust";
                });

                const beautifulData = await Promise.all(filteredData.map((token: BalanceItem) => toBeautifulData(token)));
                setTokens(beautifulData);
                setTotalBalance(parseFloat(tokensData.totalCost.toFixed(2)));
                setTotalChange(parseFloat(calculateTotalChangeInPercent(filteredData)));
            };

            fetchData();
        }
    }, [toBeautifulData, tokensData]);

    useEffect(() => {
        if (transactionsData) {
            const fetchTransactionData = async () => {
                const beautifulTransactionData = await Promise.all(transactionsData.transactions.map((transaction: tSdk) => toBeautifulTransactionData(transaction)));
                setTransactionData(beautifulTransactionData as Transaction[] || []);
                setTotalItems(transactionsData.total);
            };
            fetchTransactionData();
        }
    }, [toBeautifulTransactionData, transactionsData, page]);


    useEffect(() => {
        if (nftsData) {
            const fetchNftData = async () => {
                const beautifulNftData = await Promise.all(nftsData.nfts.map((nft: NftTokenContractBalanceItem) => toBeautifulNftData(nft)));
                setNfts(beautifulNftData || []);
            };
            fetchNftData();
        }
    }, [nftsData, toBeautifulNftData]);

    const checkUrlResponse = async (url: string): Promise<boolean> => {
        try {
            const response = await fetch(url, { mode: 'no-cors' });
            if (response.ok) return true;
        } catch {
            console.log("Something went wrong with the image");
            return false;
        }
        return false;
    };



    const loading = isNftLoading || isTokenLoading || isTransactionLoading;


    const tokensInNetworkTotal = [
        {
            name: "Ethereum",
            symbol: "ETH",
            balance: `${(totalBalance / 2789).toFixed(5)} ETH`,
            value: "2,850.00",
            change: totalChange,
            icon: "/placeholder.svg",
        },
    ]

    return (
        <>
            {
                !addressToCheck ? (
                    <div className="min-h-full bg-background flex flex-col items-center justify-center p-4">

                        <div className="w-full max-w-3xl space-y-8">
                            <h1 className="text-4xl font-bold text-center text-primary">{t("connectYourWallet")}</h1>
                            <div className="text-center text-muted-foreground">
                                <p>{t("enterWalletAddress")}</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 w-full">
                                <div className="relative flex-1">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input placeholder="Enter wallet address" className="pl-10 w-full" />
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[140px]"
                                        onClick={() => {
                                            const addressInput = document.querySelector('input[placeholder="Enter wallet address"]') as HTMLInputElement;
                                            if (addressInput && addressInput.value) {
                                                if (checkIfCorrectAddress(addressInput.value)) {
                                                    window.location.href = `?address=${addressInput.value}`;
                                                } else {
                                                    toast.error("Invalid address");
                                                }
                                            }
                                        }}
                                    >
                                        {t("checkBalance")}
                                    </Button>
                                </div>
                            </div>


                        </div>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                        {error && <ErrorAlert message={error} onRetry={() => setError(null)} />}

                        <ProfileCard address={
                            addressToCheck ? shortenAddress(addressToCheck as string) : "0x"
                        } balance={totalBalance} change={totalChange ? `${totalChange}%` : ''} loading={loading} />

                        <div className="flex gap-3 items-center mt-8">
                            {
                                tokensInNetworkTotal.map((token) => (
                                    <TokenCard key={uuidV4()} {...token} isLoading={loading} />
                                ))
                            }
                        </div>




                        <Tabs defaultValue="portfolio" className="mt-8">
                            <TabsList className="bg-gray-100/50">
                                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                                <TabsTrigger value="nfts">NFTs</TabsTrigger>
                                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                            </TabsList>
                            <TabsContent value="portfolio" className="mt-6">
                                <WalletTable tokens={tokens ?? []} totalValue={totalBalance} loading={loading} />
                            </TabsContent>
                            <TabsContent value="nfts">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {nfts.map((nft: any) => (
                                        <NFTCard key={uuidV4()} {...nft} />
                                    ))}
                                </div>
                            </TabsContent>
                            <TabsContent value="transactions">
                                <TransactionList
                                    transactions={transactionData as Transaction[]} page={page} setPage={setPage} addressToCheck={addressToCheck} totalItems={totalItems} />
                            </TabsContent>
                        </Tabs>
                    </div>
                )
            }
        </>


    )
}


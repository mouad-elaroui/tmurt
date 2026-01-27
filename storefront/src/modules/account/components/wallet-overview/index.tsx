"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface WalletData {
    id: string
    balance: number
    currency_code: string
}

interface Transaction {
    type: "credit" | "debit"
    amount: number
    timestamp: string
    description?: string
}

// Wallet Overview Component for Account Dashboard
export function WalletOverview({ className = "" }: { className?: string }) {
    const [wallet, setWallet] = useState<WalletData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [showDetails, setShowDetails] = useState(false)

    useEffect(() => {
        fetchWallet()
    }, [])

    const fetchWallet = async () => {
        try {
            const res = await fetch("/store/wallet", { credentials: "include" })
            const data = await res.json()
            if (data.wallet) {
                setWallet(data.wallet)
            }
        } catch (e) {
            console.error("Error fetching wallet:", e)
        } finally {
            setIsLoading(false)
        }
    }

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat("en-MA", {
            style: "currency",
            currency: currency || "MAD",
        }).format(amount)
    }

    if (isLoading) {
        return (
            <div className={`${className}`}>
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                    <div className="h-8 bg-gray-200 rounded w-32" />
                </div>
            </div>
        )
    }

    return (
        <motion.div
            className={`${className}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <h3 className="text-large-semi mb-2">Wallet Balance</h3>
            <div className="flex items-end gap-x-2">
                <motion.span
                    className="text-3xl-semi leading-none"
                    style={{ color: "#b8963e" }}
                    key={wallet?.balance}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                >
                    {wallet ? formatCurrency(wallet.balance, wallet.currency_code) : "0.00 MAD"}
                </motion.span>
            </div>
            {wallet && wallet.balance > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                    Available for your next purchase
                </p>
            )}
            {!wallet || wallet.balance === 0 ? (
                <p className="text-sm text-gray-400 mt-1">
                    No wallet balance yet
                </p>
            ) : null}
        </motion.div>
    )
}

// Full Wallet Page Component
export function WalletPage() {
    const [wallet, setWallet] = useState<WalletData | null>(null)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchWalletData()
    }, [])

    const fetchWalletData = async () => {
        try {
            // Kan-jbdou l-wallet data mn l-API l-jdid
            const res = await fetch("/store/wallet/me", { credentials: "include" })
            const data = await res.json()
            if (data.wallet) {
                setWallet(data.wallet)
                // L-transactions katji direct mn l-API
                if (data.transactions) {
                    setTransactions(data.transactions.map((t: any) => ({
                        type: t.type.toLowerCase(),
                        amount: t.amount,
                        timestamp: t.created_at,
                        description: t.description,
                    })))
                }
            }
        } catch (e) {
            console.error("Error fetching wallet:", e)
        } finally {
            setIsLoading(false)
        }
    }

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat("en-MA", {
            style: "currency",
            currency: currency || "MAD",
        }).format(amount)
    }

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-32 bg-gray-200 rounded-xl" />
                    <div className="h-48 bg-gray-200 rounded-xl" />
                </div>
            </div>
        )
    }

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-2xl-semi mb-2">My Wallet</h1>
                <p className="text-gray-500">Manage your wallet balance and view transaction history</p>
            </div>

            {/* Balance Card */}
            <motion.div
                className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-2xl p-8 mb-8 text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8963e] flex items-center justify-center">
                        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-white/60 text-sm">Available Balance</p>
                        <motion.p
                            className="text-4xl font-bold text-[#d4af37]"
                            key={wallet?.balance}
                            initial={{ scale: 1.05 }}
                            animate={{ scale: 1 }}
                        >
                            {wallet ? formatCurrency(wallet.balance, wallet.currency_code) : "0.00 MAD"}
                        </motion.p>
                    </div>
                </div>
                <div className="flex gap-2 mt-6">
                    <div className="px-4 py-2 bg-white/10 rounded-full text-sm">
                        <span className="text-white/60">Currency:</span>{" "}
                        <span className="font-medium">{wallet?.currency_code || "MAD"}</span>
                    </div>
                </div>
            </motion.div>

            {/* Transaction History */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium">Transaction History</h2>
                </div>
                <div className="p-6">
                    {transactions.length > 0 ? (
                        <div className="space-y-4">
                            {transactions.map((tx, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === "credit" ? "bg-green-100" : "bg-red-100"
                                            }`}>
                                            <svg className={`w-5 h-5 ${tx.type === "credit" ? "text-green-600" : "text-red-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d={tx.type === "credit" ? "M12 4v16m8-8H4" : "M20 12H4"}
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium capitalize">{tx.type}</p>
                                            <p className="text-sm text-gray-500">
                                                {tx.timestamp ? new Date(tx.timestamp).toLocaleDateString() : "Recent"}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`font-semibold ${tx.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                                        {tx.type === "credit" ? "+" : "-"}{formatCurrency(tx.amount, wallet?.currency_code || "MAD")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p>No transactions yet</p>
                            <p className="text-sm mt-1">Your wallet activity will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default WalletOverview

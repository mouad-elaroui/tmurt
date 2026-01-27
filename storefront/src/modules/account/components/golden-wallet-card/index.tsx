"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Types dial l-wallet data
interface WalletData {
    id: string
    balance: number
    currency_code: string
}

interface Transaction {
    id: string
    amount: number
    type: "CREDIT" | "DEBIT"
    description: string | null
    reference_id: string | null
    created_at: string | null
}

interface GoldenWalletCardProps {
    className?: string
}

// Moroccan pattern SVG - zyin dial l-background
const MoroccanPattern = () => (
    <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
        <pattern id="moroccan" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M10 0L20 10L10 20L0 10Z" fill="currentColor" />
            <circle cx="10" cy="10" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#moroccan)" />
    </svg>
)

// Golden Wallet Card - L-carte dial l-wallet b design Moroccan
export default function GoldenWalletCard({ className = "" }: GoldenWalletCardProps) {
    const [isFlipped, setIsFlipped] = useState(false)
    const [wallet, setWallet] = useState<WalletData | null>(null)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Fetch wallet data - hna fin kan-jbdou l-data mn l-API
    useEffect(() => {
        fetchWalletData()
    }, [])

    const fetchWalletData = async () => {
        try {
            setLoading(true)
            const response = await fetch("/store/wallet/me", {
                credentials: "include",
            })

            if (!response.ok) {
                throw new Error("Failed to fetch wallet")
            }

            const data = await response.json()
            setWallet(data.wallet)
            setTransactions(data.transactions || [])
        } catch (err) {
            setError("Ma qderch njbed l-wallet")
            console.error("[GoldenWalletCard] Error:", err)
        } finally {
            setLoading(false)
        }
    }

    // Format currency - kan-formattiw l-flous
    const formatMoney = (amount: number, currency: string = "MAD") => {
        return new Intl.NumberFormat("fr-MA", {
            style: "currency",
            currency: currency,
            minimumFractionDigits: 0,
        }).format(amount)
    }

    // Format date - kan-formattiw l-tari5
    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return ""
        const date = new Date(dateStr)
        return date.toLocaleDateString("fr-MA", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
    }

    // Loading state
    if (loading) {
        return (
            <div className={`relative w-full max-w-md h-56 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 animate-pulse ${className}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className={`relative w-full max-w-md h-56 rounded-2xl bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center ${className}`}>
                <p className="text-red-600 text-sm">{error}</p>
            </div>
        )
    }

    // No wallet state
    if (!wallet) {
        return (
            <div className={`relative w-full max-w-md h-56 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center border-2 border-dashed border-gray-300 ${className}`}>
                <div className="text-center p-6">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-200 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-sm">No wallet yet</p>
                    <p className="text-gray-400 text-xs mt-1">Your wallet will be created when you receive credit</p>
                </div>
            </div>
        )
    }

    return (
        <div className={`relative w-full max-w-md perspective-1000 ${className}`}>
            {/* Card Container - kan-flippiw b animation */}
            <motion.div
                className="relative w-full h-56 cursor-pointer preserve-3d"
                onClick={() => setIsFlipped(!isFlipped)}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Front Side - L-balance */}
                <div
                    className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden backface-hidden"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    {/* Golden gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] via-[#F4D03F] to-[#B8963E]" />

                    {/* Moroccan pattern overlay */}
                    <MoroccanPattern />

                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent" />

                    {/* Content */}
                    <div className="relative h-full p-6 flex flex-col justify-between text-white">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-wider opacity-80">Tmurt Wallet</p>
                                <p className="text-sm opacity-60 mt-1">Your store credit</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                        </div>

                        {/* Balance */}
                        <div>
                            <p className="text-xs uppercase tracking-wider opacity-60 mb-1">Available Balance</p>
                            <p className="text-4xl font-bold tracking-tight">
                                {formatMoney(wallet.balance, wallet.currency_code)}
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                            <p className="text-xs opacity-60">Tap to see history</p>
                            <div className="flex items-center gap-1 text-xs opacity-60">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span>Flip</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back Side - Transaction History */}
                <div
                    className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden backface-hidden"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                    {/* Dark golden background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23]" />

                    {/* Golden border accent */}
                    <div className="absolute inset-0 rounded-2xl border border-[#D4AF37]/30" />

                    {/* Content */}
                    <div className="relative h-full p-4 flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#D4AF37]/20">
                            <p className="text-sm font-medium text-[#D4AF37]">Transaction History</p>
                            <p className="text-xs text-gray-400">Tap to flip back</p>
                        </div>

                        {/* Transactions List */}
                        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                            {transactions.length === 0 ? (
                                <div className="h-full flex items-center justify-center">
                                    <p className="text-gray-500 text-sm">No transactions yet</p>
                                </div>
                            ) : (
                                transactions.slice(0, 5).map((tx) => (
                                    <div
                                        key={tx.id}
                                        className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === "CREDIT" ? "bg-green-500/20" : "bg-red-500/20"
                                                }`}>
                                                {tx.type === "CREDIT" ? (
                                                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-xs text-white/80 truncate max-w-[120px]">
                                                    {tx.description || (tx.type === "CREDIT" ? "Credit" : "Payment")}
                                                </p>
                                                <p className="text-[10px] text-gray-500">{formatDate(tx.created_at)}</p>
                                            </div>
                                        </div>
                                        <p className={`text-sm font-medium ${tx.type === "CREDIT" ? "text-green-400" : "text-red-400"
                                            }`}>
                                            {tx.type === "CREDIT" ? "+" : "-"}{formatMoney(tx.amount)}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* CSS for 3D transforms */}
            <style jsx>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .preserve-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(212, 175, 55, 0.3);
                    border-radius: 2px;
                }
            `}</style>
        </div>
    )
}

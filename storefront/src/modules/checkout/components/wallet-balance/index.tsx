"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useCallback } from "react"

interface WalletData {
    id: string
    customer_id: string
    balance: number
    currency_code: string
}

interface WalletBalanceProps {
    onUseWallet?: (amount: number) => void
    cartTotal?: number
    isSelected?: boolean
    onSelect?: () => void
    className?: string
}

// Wallet Balance Component - L-component dial l-balance
export function WalletBalance({
    onUseWallet,
    cartTotal = 0,
    isSelected = false,
    onSelect,
    className = "",
}: WalletBalanceProps) {
    const [wallet, setWallet] = useState<WalletData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Fetch wallet balance on mount
    useEffect(() => {
        fetchWalletBalance()
    }, [])

    const fetchWalletBalance = async () => {
        setIsLoading(true)
        try {
            const response = await fetch("/store/wallet", {
                credentials: "include",
            })

            if (!response.ok) {
                throw new Error("Failed to fetch wallet")
            }

            const data = await response.json()
            if (data.wallet) {
                setWallet(data.wallet)
            } else {
                setWallet(null)
            }
        } catch (err) {
            setError("Unable to load wallet")
            setWallet(null)
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

    const balance = wallet?.balance || 0
    const currency = wallet?.currency_code || "MAD"
    const canCoverTotal = balance >= cartTotal
    const amountToUse = Math.min(balance, cartTotal)

    if (isLoading) {
        return (
            <div className={`p-4 rounded-lg border border-gray-200 ${className}`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                    <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
                    </div>
                </div>
            </div>
        )
    }

    if (error || !wallet || balance === 0) {
        return null // Don't show if no wallet or zero balance
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
        p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
        ${isSelected
                    ? "border-[#d4af37] bg-gradient-to-r from-[#fdfbf7] to-[#f9f3e8] shadow-lg"
                    : "border-gray-200 bg-white hover:border-[#d4af37]/50"
                }
        ${className}
      `}
            onClick={onSelect}
            whileTap={{ scale: 0.98 }}
        >
            <div className="flex items-center gap-4">
                {/* Wallet Icon */}
                <div className={`
          w-12 h-12 rounded-full flex items-center justify-center
          ${isSelected
                        ? "bg-gradient-to-br from-[#d4af37] to-[#b8963e]"
                        : "bg-gradient-to-br from-gray-100 to-gray-200"
                    }
        `}>
                    <svg
                        className={`w-6 h-6 ${isSelected ? "text-white" : "text-gray-500"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                    </svg>
                </div>

                {/* Wallet Info */}
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">Wallet Balance</span>
                        <motion.span
                            className="text-lg font-bold text-[#b8963e]"
                            key={balance}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                        >
                            {formatCurrency(balance, currency)}
                        </motion.span>
                    </div>

                    {isSelected && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-2 pt-2 border-t border-[#d4af37]/20"
                        >
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Amount to use:</span>
                                <span className="font-medium text-[#8b7355]">
                                    {formatCurrency(amountToUse, currency)}
                                </span>
                            </div>
                            {!canCoverTotal && (
                                <p className="text-xs text-amber-600 mt-1">
                                    Remaining {formatCurrency(cartTotal - amountToUse, currency)} will need another payment method
                                </p>
                            )}
                            {canCoverTotal && (
                                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Covers full order amount
                                </p>
                            )}
                        </motion.div>
                    )}
                </div>

                {/* Selection Indicator */}
                <div className={`
          w-6 h-6 rounded-full border-2 flex items-center justify-center
          ${isSelected ? "border-[#d4af37] bg-[#d4af37]" : "border-gray-300"}
        `}>
                    {isSelected && (
                        <motion.svg
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-4 h-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </motion.svg>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

// Mini Wallet Display for Account section
export function WalletMini({ className = "" }: { className?: string }) {
    const [balance, setBalance] = useState<number>(0)
    const [currency, setCurrency] = useState<string>("MAD")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch("/store/wallet", { credentials: "include" })
            .then((res) => res.json())
            .then((data) => {
                setBalance(data.balance || 0)
                setCurrency(data.currency_code || "MAD")
            })
            .catch(() => { })
            .finally(() => setIsLoading(false))
    }, [])

    if (isLoading) {
        return <div className="h-6 w-20 bg-gray-200 animate-pulse rounded" />
    }

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8963e] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            </div>
            <div>
                <span className="text-xs text-gray-500">Balance</span>
                <p className="font-semibold text-[#8b7355]">
                    {new Intl.NumberFormat("en-MA", {
                        style: "currency",
                        currency: currency,
                    }).format(balance)}
                </p>
            </div>
        </div>
    )
}

export default WalletBalance

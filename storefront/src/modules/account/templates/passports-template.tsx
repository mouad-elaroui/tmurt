"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface Passport {
    id: string
    order_id: string
    token_id: string
    metadata?: {
        created_at?: string
        display_id?: string
    }
}

export default function PassportsTemplate() {
    const [passports, setPassports] = useState<Passport[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchPassports()
    }, [])

    const fetchPassports = async () => {
        try {
            const res = await fetch("/store/passports", { credentials: "include" })
            const data = await res.json()
            if (data.passports) {
                setPassports(data.passports)
            }
        } catch (e) {
            console.error("Error fetching passports:", e)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="w-full">
                <div className="mb-8">
                    <h1 className="text-2xl-semi mb-2">My Digital Passports</h1>
                    <p className="text-gray-500">Loading your authenticity certificates...</p>
                </div>
                <div className="animate-pulse space-y-4">
                    <div className="h-32 bg-gray-200 rounded-xl" />
                    <div className="h-32 bg-gray-200 rounded-xl" />
                </div>
            </div>
        )
    }

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-2xl-semi mb-2">My Digital Passports</h1>
                <p className="text-gray-500">Your product authenticity certificates</p>
            </div>

            {passports.length > 0 ? (
                <div className="space-y-4">
                    {passports.map((passport, index) => (
                        <motion.div
                            key={passport.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200 relative overflow-hidden"
                        >
                            {/* Background Shield Icon */}
                            <div className="absolute top-4 right-4 opacity-10">
                                <svg className="w-24 h-24 text-amber-700" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </div>

                            <div className="relative z-10">
                                {/* Header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                            <path d="M9 12l2 2 4-4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-amber-900">Verified Authentic</p>
                                        <p className="text-sm text-amber-700">Tmurt Craftsmanship</p>
                                    </div>
                                </div>

                                {/* Token Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div className="bg-white/60 rounded-lg p-3">
                                        <p className="text-xs uppercase text-amber-600 font-medium tracking-wider mb-1">Token ID</p>
                                        <p className="font-mono text-sm text-amber-900 break-all">{passport.token_id}</p>
                                    </div>
                                    <div className="bg-white/60 rounded-lg p-3">
                                        <p className="text-xs uppercase text-amber-600 font-medium tracking-wider mb-1">Order</p>
                                        <p className="font-mono text-sm text-amber-900">
                                            #{passport.metadata?.display_id || passport.order_id.slice(-8)}
                                        </p>
                                    </div>
                                </div>

                                {/* Status & Date */}
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-amber-200">
                                    <div className="flex items-center gap-2">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                        <span className="text-xs font-medium text-green-700">VERIFIED</span>
                                    </div>
                                    {passport.metadata?.created_at && (
                                        <span className="text-xs text-amber-600">
                                            Created {new Date(passport.metadata.created_at).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-gray-50 rounded-xl">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                        <svg className="w-10 h-10 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Passports Yet</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        When you purchase authentic Tmurt products, your digital authenticity certificates will appear here.
                    </p>
                </div>
            )}
        </div>
    )
}

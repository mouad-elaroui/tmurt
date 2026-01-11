"use client"

import { motion } from "framer-motion"
import { QRCodeSVG } from "qrcode.react"
import { useState, useEffect } from "react"
import { MoroccanCard, MoroccanButton } from "@modules/common/components/pattern"

interface DigitalPassportProps {
    orderId: string
    orderDate?: string
    customerName?: string
    tokenId?: string
    className?: string
}

// Digital Passport Component 
export function DigitalPassport({
    orderId,
    orderDate,
    customerName,
    tokenId,
    className = "",
}: DigitalPassportProps) {
    const [passportData, setPassportData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isFlipped, setIsFlipped] = useState(false)

    // Generate or fetch passport data
    useEffect(() => {
        // For now, generate passport data client-side
        // In production, this would fetch from /store/digital-passport/:orderId
        const generatedToken = tokenId || `TMURT-${orderId.slice(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`

        setPassportData({
            id: orderId,
            token_id: generatedToken,
            order_id: orderId,
            issued_date: orderDate || new Date().toISOString(),
            customer_name: customerName || "Valued Customer",
            verification_url: `${typeof window !== "undefined" ? window.location.origin : ""}/verify/${generatedToken}`,
        })
        setIsLoading(false)
    }, [orderId, orderDate, customerName, tokenId])

    const handleDownload = () => {
        // Create downloadable passport card
        const dataStr = JSON.stringify(passportData, null, 2)
        const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

        const link = document.createElement("a")
        link.setAttribute("href", dataUri)
        link.setAttribute("download", `tmurt-passport-${passportData.token_id}.json`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    if (isLoading) {
        return (
            <div className={`animate-pulse ${className}`}>
                <div className="h-64 bg-gray-200 rounded-xl" />
            </div>
        )
    }

    return (
        <motion.div
            className={`perspective-1000 ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Passport Card */}
            <motion.div
                className="relative w-full max-w-md mx-auto cursor-pointer preserve-3d"
                onClick={() => setIsFlipped(!isFlipped)}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Front Side */}
                <div
                    className="relative backface-hidden"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    <div className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-2xl p-6 shadow-2xl border border-[#d4af37]/30">
                        {/* Header with gold accents */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8963e] flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">TMURT</h3>
                                    <p className="text-xs text-[#d4af37]">Digital Passport</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400">Issued</p>
                                <p className="text-sm text-white">
                                    {new Date(passportData.issued_date).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric"
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* QR Code Section */}
                        <div className="bg-white rounded-xl p-4 mb-6">
                            <div className="flex items-center justify-center">
                                <QRCodeSVG
                                    value={passportData.verification_url}
                                    size={140}
                                    level="H"
                                    includeMargin={false}
                                    fgColor="#1a1a2e"
                                    bgColor="#ffffff"
                                />
                            </div>
                        </div>

                        {/* Passport Info */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Customer</span>
                                <span className="text-white font-medium">{passportData.customer_name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Token ID</span>
                                <span className="text-[#d4af37] font-mono text-sm">{passportData.token_id}</span>
                            </div>
                        </div>

                        {/* Decorative Footer */}
                        <div className="mt-6 pt-4 border-t border-gray-700">
                            <div className="flex items-center justify-between">
                                <div className="flex gap-1">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="w-2 h-2 rounded-full bg-[#d4af37]" style={{ opacity: 1 - i * 0.3 }} />
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500">Tap to flip</p>
                                <div className="flex gap-1">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="w-2 h-2 rounded-full bg-[#d4af37]" style={{ opacity: 0.4 + i * 0.3 }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back Side */}
                <div
                    className="absolute inset-0 backface-hidden"
                    style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)"
                    }}
                >
                    <div className="bg-gradient-to-br from-[#0f3460] via-[#16213e] to-[#1a1a2e] rounded-2xl p-6 shadow-2xl border border-[#d4af37]/30 h-full">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-bold text-white mb-2">Authenticity Certificate</h3>
                            <p className="text-sm text-gray-400">
                                This digital passport certifies the authenticity of your purchase from Tmurt
                            </p>
                        </div>

                        <div className="space-y-4 text-sm">
                            <div className="bg-white/5 rounded-lg p-3">
                                <p className="text-gray-400 mb-1">Order Reference</p>
                                <p className="text-white font-mono">{passportData.order_id}</p>
                            </div>

                            <div className="bg-white/5 rounded-lg p-3">
                                <p className="text-gray-400 mb-1">Verification Link</p>
                                <p className="text-[#d4af37] font-mono text-xs break-all">
                                    {passportData.verification_url}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-700 text-center">
                            <p className="text-xs text-gray-500 mb-4">
                                Scan the QR code on the front to verify authenticity
                            </p>
                            <div className="flex gap-2 justify-center">
                                {/* Moroccan pattern decoration */}
                                <svg width="60" height="20" viewBox="0 0 60 20" className="text-[#d4af37]">
                                    <path d="M10 10 L20 0 L30 10 L40 0 L50 10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M10 10 L20 20 L30 10 L40 20 L50 10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Actions */}
            <div className="flex justify-center gap-4 mt-6">
                <MoroccanButton
                    onClick={handleDownload}
                    variant="outline"
                    size="sm"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Save Passport
                </MoroccanButton>
                <MoroccanButton
                    onClick={() => {
                        if (navigator.share) {
                            navigator.share({
                                title: "Tmurt Digital Passport",
                                text: `My authentic purchase passport: ${passportData.token_id}`,
                                url: passportData.verification_url,
                            })
                        }
                    }}
                    variant="secondary"
                    size="sm"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                </MoroccanButton>
            </div>
        </motion.div>
    )
}

// Compact passport badge for order lists
export function DigitalPassportBadge({
    tokenId,
    className = ""
}: {
    tokenId: string
    className?: string
}) {
    return (
        <motion.div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#1a1a2e] to-[#16213e] border border-[#d4af37]/30 ${className}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
        >
            <svg className="w-4 h-4 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-xs font-mono text-white">{tokenId}</span>
        </motion.div>
    )
}

export default DigitalPassport

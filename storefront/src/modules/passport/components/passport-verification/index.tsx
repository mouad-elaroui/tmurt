"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Types dial l-passport data
interface Origin {
    city: string
    region: string
    country: string
    artisan?: string
}

interface Fabric {
    type: string
    quality: string
    certified: boolean
    certificate_id?: string
}

interface OwnershipLog {
    owner_id: string
    owner_name?: string
    date: string
    action: "CREATED" | "TRANSFERRED" | "VERIFIED"
}

interface PassportData {
    id: string
    token: string
    created_at: string
    origin: Origin
    fabric: Fabric
    ownership_log: OwnershipLog[]
    product?: {
        name: string
        sku?: string
        category?: string
    }
    qr: {
        url: string
        token: string
    }
}

// Moroccan Border Pattern SVG - Zellige-inspired
const MoroccanBorder = ({ className = "" }: { className?: string }) => (
    <svg className={`absolute ${className}`} viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
            <pattern id="zellige" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M5 0L10 5L5 10L0 5Z" fill="none" stroke="#D4AF37" strokeWidth="0.3" />
                <circle cx="5" cy="5" r="1.5" fill="none" stroke="#D4AF37" strokeWidth="0.2" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#zellige)" />
    </svg>
)

// Watermark Motif - background pattern
const WatermarkPattern = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
        <svg className="w-full h-full" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">
            <defs>
                <pattern id="watermark" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M25 0L50 25L25 50L0 25Z" fill="none" stroke="#D4AF37" strokeWidth="1" />
                    <circle cx="25" cy="25" r="8" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
                    <circle cx="25" cy="25" r="15" fill="none" stroke="#D4AF37" strokeWidth="0.3" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#watermark)" />
        </svg>
    </div>
)

// Verification Seal - l-khatm dial l-authenticity
const VerificationSeal = ({ valid }: { valid: boolean }) => (
    <div className={`relative w-24 h-24 ${valid ? "text-green-600" : "text-red-600"}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Outer ring */}
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2" />
            {/* Inner decorative ring */}
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
            {/* Star pattern */}
            {[...Array(8)].map((_, i) => (
                <line
                    key={i}
                    x1="50"
                    y1="15"
                    x2="50"
                    y2="25"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    transform={`rotate(${i * 45} 50 50)`}
                />
            ))}
            {/* Center icon */}
            {valid ? (
                <path
                    d="M35 50L45 60L65 40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            ) : (
                <>
                    <line x1="35" y1="35" x2="65" y2="65" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    <line x1="65" y1="35" x2="35" y2="65" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </>
            )}
        </svg>
        <p className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold uppercase whitespace-nowrap`}>
            {valid ? "Verified" : "Invalid"}
        </p>
    </div>
)

interface Props {
    tokenId: string
}

// Passport Verification Page - L-page dial l-authenticity
export default function PassportVerificationPage({ tokenId }: Props) {
    const [passport, setPassport] = useState<PassportData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isUnfolded, setIsUnfolded] = useState(false)

    // Fetch passport data - hna fin kan-verifiyiw
    useEffect(() => {
        fetchPassport()
    }, [tokenId])

    // Trigger unfold animation after data loads
    useEffect(() => {
        if (passport && !loading) {
            const timer = setTimeout(() => setIsUnfolded(true), 300)
            return () => clearTimeout(timer)
        }
    }, [passport, loading])

    const fetchPassport = async () => {
        try {
            setLoading(true)
            const response = await fetch(`/store/product-passport/${tokenId}`)
            const data = await response.json()

            if (!data.valid) {
                setError(data.message || "Passport not found")
                return
            }

            setPassport(data.passport)
        } catch (err) {
            setError("Unable to verify passport")
            console.error("[Passport Verification] Error:", err)
        } finally {
            setLoading(false)
        }
    }

    // Format date - kan-formattiw l-tari5
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="w-16 h-16 mx-auto mb-4">
                        <svg className="animate-spin w-full h-full text-[#D4AF37]" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="50 20" />
                        </svg>
                    </div>
                    <p className="text-gray-600">Verifying authenticity...</p>
                </motion.div>
            </div>
        )
    }

    // Error state
    if (error || !passport) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
                <motion.div
                    className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <VerificationSeal valid={false} />
                    <h1 className="text-2xl font-bold text-gray-900 mt-8 mb-2">
                        Verification Failed
                    </h1>
                    <p className="text-gray-600 mb-6">
                        {error || "This passport could not be verified."}
                    </p>
                    <LocalizedClientLink
                        href="/"
                        className="inline-block px-6 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8963E] transition-colors"
                    >
                        Return to Store
                    </LocalizedClientLink>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50 py-8 px-4">
            {/* Unfold Animation Container */}
            <motion.div
                className="max-w-2xl mx-auto"
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{
                    scaleY: isUnfolded ? 1 : 0,
                    opacity: isUnfolded ? 1 : 0
                }}
                transition={{
                    duration: 0.8,
                    ease: [0.4, 0, 0.2, 1],
                    delay: 0.2
                }}
                style={{ transformOrigin: "top" }}
            >
                {/* Main Passport Document */}
                <div className="relative bg-gradient-to-b from-[#fffbf0] to-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Golden border */}
                    <div className="absolute inset-0 rounded-3xl border-4 border-[#D4AF37]/40 pointer-events-none" />
                    <div className="absolute inset-2 rounded-2xl border border-[#D4AF37]/20 pointer-events-none" />

                    {/* Watermark */}
                    <WatermarkPattern />

                    {/* Corner decorations */}
                    <div className="absolute top-0 left-0 w-20 h-20">
                        <MoroccanBorder className="w-full h-full opacity-30" />
                    </div>
                    <div className="absolute top-0 right-0 w-20 h-20 rotate-90">
                        <MoroccanBorder className="w-full h-full opacity-30" />
                    </div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 -rotate-90">
                        <MoroccanBorder className="w-full h-full opacity-30" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-20 h-20 rotate-180">
                        <MoroccanBorder className="w-full h-full opacity-30" />
                    </div>

                    {/* Content */}
                    <div className="relative p-8 md:p-12">
                        {/* Header */}
                        <motion.div
                            className="text-center mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="flex justify-center mb-4">
                                <VerificationSeal valid={true} />
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-8 mb-2 tracking-wide">
                                CERTIFICATE OF AUTHENTICITY
                            </h1>
                            <p className="text-[#D4AF37] font-medium uppercase tracking-widest text-sm">
                                Digital Product Passport
                            </p>
                        </motion.div>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-8">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
                            <div className="w-3 h-3 rotate-45 border border-[#D4AF37]/50" />
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
                        </div>

                        {/* Token ID */}
                        <motion.div
                            className="text-center mb-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Passport ID</p>
                            <p className="font-mono text-lg md:text-xl text-gray-800 font-bold tracking-wider">
                                {passport.token}
                            </p>
                        </motion.div>

                        {/* Product Info */}
                        {passport.product && (
                            <motion.div
                                className="bg-[#D4AF37]/5 rounded-xl p-6 mb-6 border border-[#D4AF37]/10"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                            >
                                <h3 className="text-xs uppercase tracking-wider text-[#D4AF37] mb-2 font-semibold">
                                    Product
                                </h3>
                                <p className="text-xl font-medium text-gray-900">
                                    {passport.product.name}
                                </p>
                                {passport.product.category && (
                                    <p className="text-sm text-gray-500 mt-1">{passport.product.category}</p>
                                )}
                            </motion.div>
                        )}

                        {/* Origin & Fabric Grid */}
                        <motion.div
                            className="grid md:grid-cols-2 gap-6 mb-6"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            {/* Origin */}
                            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                                <h3 className="text-xs uppercase tracking-wider text-[#D4AF37] mb-3 font-semibold flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Origin
                                </h3>
                                <p className="text-gray-900 font-medium">{passport.origin.city}</p>
                                <p className="text-gray-500 text-sm">{passport.origin.region}, {passport.origin.country}</p>
                                {passport.origin.artisan && (
                                    <p className="text-[#D4AF37] text-sm mt-2">
                                        Crafted by {passport.origin.artisan}
                                    </p>
                                )}
                            </div>

                            {/* Fabric */}
                            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                                <h3 className="text-xs uppercase tracking-wider text-[#D4AF37] mb-3 font-semibold flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                    Fabric Certification
                                </h3>
                                <p className="text-gray-900 font-medium">{passport.fabric.type}</p>
                                <p className="text-gray-500 text-sm">{passport.fabric.quality} Quality</p>
                                {passport.fabric.certified && (
                                    <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Certified Authentic</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Ownership History - Blockchain Style */}
                        <motion.div
                            className="mb-8"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                        >
                            <h3 className="text-xs uppercase tracking-wider text-[#D4AF37] mb-4 font-semibold flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Ownership History
                            </h3>
                            <div className="relative">
                                {/* Timeline line */}
                                <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-[#D4AF37] to-transparent" />

                                <div className="space-y-4">
                                    {passport.ownership_log.map((log, index) => (
                                        <div key={index} className="relative pl-10">
                                            {/* Timeline dot */}
                                            <div className={`absolute left-2.5 top-2 w-3 h-3 rounded-full border-2 ${log.action === "CREATED" ? "bg-[#D4AF37] border-[#D4AF37]" :
                                                    log.action === "TRANSFERRED" ? "bg-blue-500 border-blue-500" :
                                                        "bg-green-500 border-green-500"
                                                }`} />

                                            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${log.action === "CREATED" ? "bg-amber-100 text-amber-700" :
                                                            log.action === "TRANSFERRED" ? "bg-blue-100 text-blue-700" :
                                                                "bg-green-100 text-green-700"
                                                        }`}>
                                                        {log.action}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {formatDate(log.date)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-700">
                                                    {log.owner_name || log.owner_id}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Footer */}
                        <motion.div
                            className="text-center pt-6 border-t border-gray-100"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                        >
                            <p className="text-xs text-gray-400 mb-2">
                                Issued on {formatDate(passport.created_at)}
                            </p>
                            <p className="text-sm text-gray-500">
                                This certificate confirms the authenticity of your Tmurt product.
                            </p>

                            {/* Share button */}
                            <button
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: "Tmurt Product Passport",
                                            text: "Verify the authenticity of my Tmurt product",
                                            url: window.location.href,
                                        })
                                    } else {
                                        navigator.clipboard.writeText(window.location.href)
                                        alert("Verification link copied!")
                                    }
                                }}
                                className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-white rounded-full hover:bg-[#B8963E] transition-colors shadow-lg shadow-[#D4AF37]/20"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                                Share Verification
                            </button>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface SizingProfile {
    id: string
    recommended_size: string
    chest?: number
    waist?: number
    hips?: number
    height?: number
    updated_at?: string
}

// Sizing Profile Overview for Account Dashboard
export function SizingProfileOverview({ className = "" }: { className?: string }) {
    const [profile, setProfile] = useState<SizingProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // For demo, we'll simulate fetching sizing data
        // In production, this would call /store/sizing/profile
        setTimeout(() => {
            setIsLoading(false)
            // Uncomment when API is ready:
            // fetchProfile()
        }, 500)
    }, [])

    if (isLoading) {
        return (
            <div className={`${className}`}>
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                    <div className="h-8 bg-gray-200 rounded w-16" />
                </div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className={className}>
                <h3 className="text-large-semi mb-2">My Size</h3>
                <p className="text-gray-400 text-sm">
                    Not set yet
                </p>
                <p className="text-xs text-gray-400 mt-1">
                    Use the size calculator on any product page
                </p>
            </div>
        )
    }

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h3 className="text-large-semi mb-2">My Size</h3>
            <div className="flex items-center gap-3">
                <motion.div
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8963e] flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                >
                    <span className="text-white font-bold text-lg">{profile.recommended_size}</span>
                </motion.div>
                <div>
                    <p className="text-sm text-gray-500">
                        Based on your measurements
                    </p>
                    {profile.updated_at && (
                        <p className="text-xs text-gray-400">
                            Updated {new Date(profile.updated_at).toLocaleDateString()}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

// Full Sizing Profile Page
export function SizingProfilePage() {
    const [profile, setProfile] = useState<SizingProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)

    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            setIsLoading(false)
        }, 500)
    }, [])

    const sizeGuide = {
        XS: { chest: "< 88", waist: "< 72", description: "Extra Small" },
        S: { chest: "88-96", waist: "72-80", description: "Small" },
        M: { chest: "96-104", waist: "80-88", description: "Medium" },
        L: { chest: "104-112", waist: "88-96", description: "Large" },
        XL: { chest: "112-124", waist: "96-108", description: "Extra Large" },
        XXL: { chest: "> 124", waist: "> 108", description: "Double Extra Large" },
    }

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="h-32 bg-gray-200 rounded-xl" />
                <div className="h-64 bg-gray-200 rounded-xl" />
            </div>
        )
    }

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-2xl-semi mb-2">My Size Profile</h1>
                <p className="text-gray-500">Manage your sizing preferences for the perfect fit</p>
            </div>

            {/* Current Size Card */}
            {profile ? (
                <motion.div
                    className="bg-gradient-to-br from-[#fdfbf7] to-[#f0e4cc] border border-[#d4af37]/30 rounded-2xl p-8 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8963e] flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-2xl">{profile.recommended_size}</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Your Recommended Size</h2>
                            <p className="text-gray-600 mt-1">Based on your measurements</p>
                        </div>
                    </div>

                    {/* Measurements */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        <div className="bg-white rounded-lg p-4 border border-[#d4af37]/20">
                            <p className="text-sm text-gray-500">Chest</p>
                            <p className="text-lg font-semibold">{profile.chest || "—"} cm</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-[#d4af37]/20">
                            <p className="text-sm text-gray-500">Waist</p>
                            <p className="text-lg font-semibold">{profile.waist || "—"} cm</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-[#d4af37]/20">
                            <p className="text-sm text-gray-500">Hips</p>
                            <p className="text-lg font-semibold">{profile.hips || "—"} cm</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-[#d4af37]/20">
                            <p className="text-sm text-gray-500">Height</p>
                            <p className="text-lg font-semibold">{profile.height || "—"} cm</p>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center mb-8">
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No Size Profile Yet</h3>
                    <p className="text-gray-500 mb-6">Use the size calculator on any product page to save your measurements</p>
                    <button
                        className="px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#b8963e] text-white font-medium rounded-lg hover:shadow-lg transition-all"
                        onClick={() => setIsCalculatorOpen(true)}
                    >
                        Calculate My Size
                    </button>
                </div>
            )}

            {/* Size Guide */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium">Size Guide</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Size</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Chest (cm)</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Waist (cm)</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {Object.entries(sizeGuide).map(([size, info]) => (
                                <tr key={size} className={profile?.recommended_size === size ? "bg-amber-50" : ""}>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${profile?.recommended_size === size
                                                ? "bg-gradient-to-r from-[#d4af37] to-[#b8963e] text-white font-bold"
                                                : "bg-gray-100 text-gray-700"
                                            }`}>
                                            {size}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{info.chest}</td>
                                    <td className="px-6 py-4 text-gray-600">{info.waist}</td>
                                    <td className="px-6 py-4 text-gray-500">{info.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default SizingProfileOverview

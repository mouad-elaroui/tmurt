"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Sizing calculation - Hssab l-qyas
function calculateSizeFromChest(chest: number): { size: string; details: string } {
    if (chest < 88) return { size: "XS", details: "Extra Small - Chest < 88cm" }
    if (chest < 96) return { size: "S", details: "Small - Chest 88-96cm" }
    if (chest < 104) return { size: "M", details: "Medium - Chest 96-104cm" }
    if (chest < 112) return { size: "L", details: "Large - Chest 104-112cm" }
    if (chest < 124) return { size: "XL", details: "Extra Large - Chest 112-124cm" }
    return { size: "XXL", details: "Double Extra Large - Chest > 124cm" }
}

interface SizingProfile {
    chest: number
    shoulders?: number
    belly?: number
    hips?: number
    height?: number
    recommendedSize: string
    updatedAt: string
}

const STORAGE_KEY = "tmurt_sizing_profile"

export default function SizeCalculatorPage() {
    const [chest, setChest] = useState("")
    const [shoulders, setShoulders] = useState("")
    const [belly, setBelly] = useState("")
    const [hips, setHips] = useState("")
    const [height, setHeight] = useState("")
    const [savedProfile, setSavedProfile] = useState<SizingProfile | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    // Njibo l-saved data mlli kat-loadi l-page
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                const parsed = JSON.parse(stored) as SizingProfile
                setSavedProfile(parsed)
                // N-filliw l-inputs
                setChest(parsed.chest.toString())
                if (parsed.shoulders) setShoulders(parsed.shoulders.toString())
                if (parsed.belly) setBelly(parsed.belly.toString())
                if (parsed.hips) setHips(parsed.hips.toString())
                if (parsed.height) setHeight(parsed.height.toString())
            }
        } catch (err) {
            console.error("Ma9derch n-loadi sizing:", err)
        }
    }, [])

    const handleSave = () => {
        if (!chest) return

        setIsSaving(true)

        const chestNum = parseFloat(chest)
        const profile: SizingProfile = {
            chest: chestNum,
            shoulders: shoulders ? parseFloat(shoulders) : undefined,
            belly: belly ? parseFloat(belly) : undefined,
            hips: hips ? parseFloat(hips) : undefined,
            height: height ? parseFloat(height) : undefined,
            recommendedSize: calculateSizeFromChest(chestNum).size,
            updatedAt: new Date().toISOString(),
        }

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
            setSavedProfile(profile)
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 3000)
        } catch (err) {
            console.error("Ma9derch n-saveyi:", err)
        }

        setIsSaving(false)
    }

    const handleClear = () => {
        localStorage.removeItem(STORAGE_KEY)
        setSavedProfile(null)
        setChest("")
        setShoulders("")
        setBelly("")
        setHips("")
        setHeight("")
    }

    const currentSize = chest ? calculateSizeFromChest(parseFloat(chest)) : null

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#fdfbf7] to-[#f9f3e8]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#d4af37] to-[#b8963e] py-12">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-4xl font-bold text-white mb-3"
                        style={{ fontFamily: '"Cinzel Decorative", Georgia, serif' }}
                    >
                        Find Your Perfect Size
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/90"
                    >
                        Save your measurements once, use them on every product
                    </motion.p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Measurement Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-2xl shadow-lg p-8 border border-[#d4af37]/20"
                    >
                        <h2 className="text-xl font-semibold text-[#4a3f2e] mb-6">
                            Your Measurements
                        </h2>

                        <div className="space-y-5">
                            {/* Chest */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Chest / الصدر <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={chest}
                                        onChange={(e) => setChest(e.target.value)}
                                        placeholder="e.g., 100"
                                        className="w-full px-4 py-3 border border-[#d4af37]/30 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none transition"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">cm</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Measure around the fullest part of your chest
                                </p>
                            </div>

                            {/* Shoulders */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Shoulders / الكتاف (Optional)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={shoulders}
                                        onChange={(e) => setShoulders(e.target.value)}
                                        placeholder="e.g., 45"
                                        className="w-full px-4 py-3 border border-[#d4af37]/30 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none transition"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">cm</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Measure from shoulder to shoulder
                                </p>
                            </div>

                            {/* Belly */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Belly / البطن (Optional)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={belly}
                                        onChange={(e) => setBelly(e.target.value)}
                                        placeholder="e.g., 85"
                                        className="w-full px-4 py-3 border border-[#d4af37]/30 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none transition"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">cm</span>
                                </div>
                            </div>

                            {/* Hips */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Hips / الوركين (Optional)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={hips}
                                        onChange={(e) => setHips(e.target.value)}
                                        placeholder="e.g., 105"
                                        className="w-full px-4 py-3 border border-[#d4af37]/30 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none transition"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">cm</span>
                                </div>
                            </div>

                            {/* Height */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Height / الطول (Optional)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={height}
                                        onChange={(e) => setHeight(e.target.value)}
                                        placeholder="e.g., 170"
                                        className="w-full px-4 py-3 border border-[#d4af37]/30 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none transition"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">cm</span>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handleSave}
                                    disabled={!chest || isSaving}
                                    className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#b8963e] text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? "Saving..." : "Save My Measurements"}
                                </button>
                                {savedProfile && (
                                    <button
                                        onClick={handleClear}
                                        className="px-4 py-3 border border-red-300 text-red-500 rounded-lg hover:bg-red-50 transition"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Size Result */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {/* Current/Live Size */}
                        {currentSize && (
                            <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#d4af37]/20 text-center">
                                <p className="text-sm text-gray-500 mb-2">Your Recommended Size</p>
                                <motion.div
                                    key={currentSize.size}
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8963e] flex items-center justify-center shadow-lg"
                                >
                                    <span className="text-4xl font-bold text-white">{currentSize.size}</span>
                                </motion.div>
                                <p className="text-gray-600">{currentSize.details}</p>
                            </div>
                        )}

                        {/* Saved Profile Info */}
                        {savedProfile && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-green-50 border border-green-200 rounded-xl p-6"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-green-800">Measurements Saved!</h3>
                                </div>
                                <p className="text-green-700 text-sm mb-4">
                                    Your size ({savedProfile.recommendedSize}) will be auto-selected on all product pages.
                                </p>
                                <p className="text-xs text-green-600">
                                    Last updated: {new Date(savedProfile.updatedAt).toLocaleDateString()}
                                </p>
                            </motion.div>
                        )}

                        {/* Success Message */}
                        {showSuccess && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="bg-[#d4af37] text-white rounded-xl p-4 text-center"
                            >
                                Measurements saved successfully!
                            </motion.div>
                        )}

                        {/* Size Guide */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#d4af37]/20">
                            <h3 className="font-semibold text-[#4a3f2e] mb-4">Size Guide</h3>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="py-2 text-left text-gray-500">Size</th>
                                        <th className="py-2 text-left text-gray-500">Chest (cm)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { size: "XS", range: "< 88" },
                                        { size: "S", range: "88 - 96" },
                                        { size: "M", range: "96 - 104" },
                                        { size: "L", range: "104 - 112" },
                                        { size: "XL", range: "112 - 124" },
                                        { size: "XXL", range: "> 124" },
                                    ].map((row) => (
                                        <tr
                                            key={row.size}
                                            className={`border-b border-gray-100 ${currentSize?.size === row.size ? "bg-[#d4af37]/10" : ""}`}
                                        >
                                            <td className="py-2 font-medium">{row.size}</td>
                                            <td className="py-2 text-gray-600">{row.range}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* CTA */}
                        <LocalizedClientLink
                            href="/store"
                            className="block text-center bg-[#4a3f2e] text-white py-4 rounded-xl font-medium hover:bg-[#3a2f1e] transition-colors"
                        >
                            Shop Now with Your Size
                        </LocalizedClientLink>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useCallback } from "react"
import { MoroccanButton, MoroccanCard } from "@modules/common/components/pattern"
import { useScrollLock } from "@lib/hooks/use-scroll-lock"

interface SizingCalculatorProps {
    isOpen: boolean
    onClose: () => void
    onSizeCalculated?: (size: string) => void
    productType?: string
}

interface MeasurementInputProps {
    label: string
    value: string
    onChange: (value: string) => void
    placeholder: string
    unit: string
    hint?: string
    icon: React.ReactNode
}

const MeasurementInput = ({
    label,
    value,
    onChange,
    placeholder,
    unit,
    hint,
    icon,
}: MeasurementInputProps) => (
    <motion.div
        className="relative"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
    >
        <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="flex items-center gap-2">
                {icon}
                {label}
            </span>
        </label>
        <div className="relative">
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="input-moroccan pr-12"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                {unit}
            </span>
        </div>
        {hint && (
            <p className="mt-1 text-xs text-gray-500">{hint}</p>
        )}
    </motion.div>
)

// Body illustration SVG - Tssawira dial l-jism
const BodyIllustration = ({ highlightedPart }: { highlightedPart: string }) => (
    <svg
        viewBox="0 0 100 180"
        className="w-32 h-48 mx-auto"
        fill="none"
        stroke="currentColor"
    >
        {/* Head */}
        <circle cx="50" cy="20" r="12" strokeWidth="2" className="text-gray-300" />

        {/* Neck */}
        <line x1="50" y1="32" x2="50" y2="40" strokeWidth="2" className="text-gray-300" />

        {/* Shoulders & Arms */}
        <path
            d="M50 40 L25 50 L20 90"
            strokeWidth="2"
            className={highlightedPart === "shoulders" ? "text-[#d4af37]" : "text-gray-300"}
        />
        <path
            d="M50 40 L75 50 L80 90"
            strokeWidth="2"
            className={highlightedPart === "shoulders" ? "text-[#d4af37]" : "text-gray-300"}
        />

        {/* Torso - Chest area */}
        <path
            d="M25 50 L25 80 L50 90 L75 80 L75 50"
            strokeWidth="2"
            className={highlightedPart === "chest" ? "text-[#d4af37]" : "text-gray-300"}
            fill={highlightedPart === "chest" ? "rgba(212, 175, 55, 0.1)" : "none"}
        />

        {/* Belly line (was waist) */}
        <ellipse
            cx="50"
            cy="90"
            rx="20"
            ry="5"
            strokeWidth="2"
            strokeDasharray={highlightedPart === "belly" ? "none" : "none"}
            className={highlightedPart === "belly" ? "text-[#d4af37]" : "text-gray-300"}
            fill={highlightedPart === "belly" ? "rgba(212, 175, 55, 0.2)" : "none"}
        />

        {/* Hips */}
        <path
            d="M30 90 L25 130 L50 135 L75 130 L70 90"
            strokeWidth="2"
            className={highlightedPart === "hips" ? "text-[#d4af37]" : "text-gray-300"}
            fill={highlightedPart === "hips" ? "rgba(212, 175, 55, 0.1)" : "none"}
        />

        {/* Legs */}
        <path d="M35 130 L30 175" strokeWidth="2" className="text-gray-300" />
        <path d="M65 130 L70 175" strokeWidth="2" className="text-gray-300" />

        {/* Height indicator */}
        {highlightedPart === "height" && (
            <>
                <line x1="90" y1="8" x2="90" y2="175" strokeWidth="1" className="text-[#d4af37]" strokeDasharray="4" />
                <path d="M88 8 L92 8" strokeWidth="2" className="text-[#d4af37]" />
                <path d="M88 175 L92 175" strokeWidth="2" className="text-[#d4af37]" />
            </>
        )}
    </svg>
)

// Size recommendation result display
const SizeResult = ({
    size,
    details,
    onSelectSize,
}: {
    size: string
    details: string
    onSelectSize: () => void
}) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-6"
    >
        <motion.div
            className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8963e] flex items-center justify-center shadow-lg"
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
            <span className="text-3xl font-bold text-white">{size}</span>
        </motion.div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Your Recommended Size
        </h3>
        <p className="text-gray-600 mb-6">{details}</p>
        <MoroccanButton onClick={onSelectSize} variant="primary">
            Use This Size
        </MoroccanButton>
    </motion.div>
)

export function SizingCalculator({
    isOpen,
    onClose,
    onSizeCalculated,
    productType = "clothing",
}: SizingCalculatorProps) {
    useScrollLock(isOpen)
    const [chest, setChest] = useState("")
    const [shoulders, setShoulders] = useState("")
    const [belly, setBelly] = useState("")
    const [hips, setHips] = useState("")
    const [height, setHeight] = useState("")
    const [focusedInput, setFocusedInput] = useState<string>("chest")
    const [isCalculating, setIsCalculating] = useState(false)
    const [result, setResult] = useState<{ size: string; details: string } | null>(null)
    const [error, setError] = useState<string | null>(null)

    const calculateSize = useCallback(async () => {
        if (!chest) {
            setError("Please enter your chest measurement")
            return
        }

        setIsCalculating(true)
        setError(null)

        try {
            // Call the backend API - Kan-3ayto 3la l-API
            const response = await fetch("/store/sizing/calculate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chest: parseFloat(chest),
                    waist: belly ? parseFloat(belly) : undefined,
                    hips: hips ? parseFloat(hips) : undefined,
                    height: height ? parseFloat(height) : undefined,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to calculate size")
            }

            const data = await response.json()
            setResult({
                size: data.recommended_size,
                details: data.details,
            })
        } catch (err) {
            // Fallback to client-side calculation if API fails
            const chestNum = parseFloat(chest)
            let size = "M"
            let details = "Based on chest measurement"

            if (chestNum < 88) {
                size = "XS"
                details = "Extra Small - Chest < 88cm"
            } else if (chestNum < 96) {
                size = "S"
                details = "Small - Chest 88-96cm"
            } else if (chestNum < 104) {
                size = "M"
                details = "Medium - Chest 96-104cm"
            } else if (chestNum < 112) {
                size = "L"
                details = "Large - Chest 104-112cm"
            } else if (chestNum < 124) {
                size = "XL"
                details = "Extra Large - Chest 112-124cm"
            } else {
                size = "XXL"
                details = "Double Extra Large - Chest > 124cm"
            }

            setResult({ size, details })
        } finally {
            setIsCalculating(false)
        }
    }, [chest, belly, hips, height])

    const handleSelectSize = () => {
        if (result && onSizeCalculated) {
            onSizeCalculated(result.size)
        }
        onClose()
    }

    const resetCalculator = () => {
        setChest("")
        setBelly("")
        setHips("")
        setHeight("")
        setResult(null)
        setError(null)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal - pt-28 bach y-nzel mezyan taht navbar */}
                    <motion.div
                        className="fixed inset-0 z-[101] flex items-start justify-center p-4 pt-28"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
                            initial={{ scale: 0.9, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 50 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            onWheel={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-[#d4af37] to-[#b8963e] px-6 py-4 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold">Find Your Perfect Size</h2>
                                        <p className="text-white/80 text-sm">
                                            Enter your measurements for personalized sizing
                                        </p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Content - n-captureiw wheel event bach scroll y-b9a f modal */}
                            <div
                                className="p-6 overflow-y-auto max-h-[calc(80vh-120px)] overscroll-contain"
                                onWheel={(e) => e.stopPropagation()}
                            >
                                {!result ? (
                                    <div className="grid md:grid-cols-2 gap-8">
                                        {/* Body Illustration */}
                                        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-6">
                                            <BodyIllustration highlightedPart={focusedInput} />
                                            <p className="text-sm text-gray-500 mt-4 text-center">
                                                Hover over each measurement to see where to measure
                                            </p>
                                        </div>

                                        {/* Measurement Inputs */}
                                        <div className="space-y-5">
                                            <div onFocus={() => setFocusedInput("chest")}>
                                                <MeasurementInput
                                                    label="Chest / الصدر"
                                                    value={chest}
                                                    onChange={setChest}
                                                    placeholder="e.g., 100"
                                                    unit="cm"
                                                    hint="Measure around the fullest part of your chest"
                                                    icon={
                                                        <svg className="w-4 h-4 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                                        </svg>
                                                    }
                                                />
                                            </div>

                                            <div onFocus={() => setFocusedInput("shoulders")}>
                                                <MeasurementInput
                                                    label="Shoulders / الكتاف (Optional)"
                                                    value={shoulders}
                                                    onChange={setShoulders}
                                                    placeholder="e.g., 45"
                                                    unit="cm"
                                                    hint="Measure from shoulder to shoulder"
                                                    icon={
                                                        <svg className="w-4 h-4 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16" />
                                                        </svg>
                                                    }
                                                />
                                            </div>

                                            <div onFocus={() => setFocusedInput("belly")}>
                                                <MeasurementInput
                                                    label="Belly / البطن (Optional)"
                                                    value={belly}
                                                    onChange={setBelly}
                                                    placeholder="e.g., 85"
                                                    unit="cm"
                                                    hint="Measure around your belly area"
                                                    icon={
                                                        <svg className="w-4 h-4 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                        </svg>
                                                    }
                                                />
                                            </div>

                                            <div onFocus={() => setFocusedInput("hips")}>
                                                <MeasurementInput
                                                    label="Hips / الوركين (Optional)"
                                                    value={hips}
                                                    onChange={setHips}
                                                    placeholder="e.g., 105"
                                                    unit="cm"
                                                    hint="Measure around the fullest part of your hips"
                                                    icon={
                                                        <svg className="w-4 h-4 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                                        </svg>
                                                    }
                                                />
                                            </div>

                                            <div onFocus={() => setFocusedInput("height")}>
                                                <MeasurementInput
                                                    label="Height / الطول (Optional)"
                                                    value={height}
                                                    onChange={setHeight}
                                                    placeholder="e.g., 170"
                                                    unit="cm"
                                                    hint="Your full height from head to toe"
                                                    icon={
                                                        <svg className="w-4 h-4 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18" />
                                                        </svg>
                                                    }
                                                />
                                            </div>

                                            {error && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-red-500 text-sm"
                                                >
                                                    {error}
                                                </motion.p>
                                            )}

                                            <div className="pt-4">
                                                <MoroccanButton
                                                    onClick={calculateSize}
                                                    disabled={isCalculating || !chest}
                                                    className="w-full"
                                                >
                                                    {isCalculating ? (
                                                        <span className="flex items-center justify-center gap-2">
                                                            <motion.span
                                                                animate={{ rotate: 360 }}
                                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                                className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                                            />
                                                            Calculating...
                                                        </span>
                                                    ) : (
                                                        "Calculate My Size"
                                                    )}
                                                </MoroccanButton>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <SizeResult
                                            size={result.size}
                                            details={result.details}
                                            onSelectSize={handleSelectSize}
                                        />
                                        <div className="text-center mt-4">
                                            <button
                                                onClick={resetCalculator}
                                                className="text-[#8b7355] hover:text-[#d4af37] text-sm underline"
                                            >
                                                Try different measurements
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default SizingCalculator

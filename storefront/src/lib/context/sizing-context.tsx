"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// sizing profile structure
interface SizingProfile {
    chest: number
    shoulders?: number
    belly?: number
    hips?: number
    height?: number
    recommendedSize: string
    updatedAt: string
}

interface SizingContextType {
    sizing: SizingProfile | null
    saveSizing: (data: Omit<SizingProfile, "recommendedSize" | "updatedAt">) => void
    clearSizing: () => void
    calculateSize: (chest: number) => string
}

const SizingContext = createContext<SizingContextType | null>(null)
const STORAGE_KEY = "tmurt_sizing_profile"

// chest -> size mapping
const calculateSizeFromChest = (chest: number): string =>
    chest < 88 ? "XS" :
        chest < 96 ? "S" :
            chest < 104 ? "M" :
                chest < 112 ? "L" :
                    chest < 124 ? "XL" : "XXL"

export function SizingProvider({ children }: { children: ReactNode }) {
    const [sizing, setSizing] = useState<SizingProfile | null>(null)

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (!stored) return
            setSizing(JSON.parse(stored) as SizingProfile)
        } catch {
            console.error("Ma9derch n-loadi sizing data")
        }
    }, [])

    const saveSizing = (data: Omit<SizingProfile, "recommendedSize" | "updatedAt">) => {
        const profile: SizingProfile = {
            ...data,
            recommendedSize: calculateSizeFromChest(data.chest),
            updatedAt: new Date().toISOString(),
        }
        setSizing(profile)
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(profile)) } catch { }
    }

    const clearSizing = () => {
        setSizing(null)
        try { localStorage.removeItem(STORAGE_KEY) } catch { }
    }

    return (
        <SizingContext.Provider value={{ sizing, saveSizing, clearSizing, calculateSize: calculateSizeFromChest }}>
            {children}
        </SizingContext.Provider>
    )
}

export function useSizing() {
    const context = useContext(SizingContext)
    if (!context) throw new Error("useSizing khass ykoun dakhel SizingProvider")
    return context
}

export function useSizingOptional() {
    return useContext(SizingContext)
}

export default SizingContext

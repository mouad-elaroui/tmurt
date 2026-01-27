"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { clx } from "@medusajs/ui"

// Categories - Moroccan Traditional Clothing
// Kaftan includes Takchita (Women only)
// Babouche (Men only)
// Djellaba and Jabador (Both genders)
const CATEGORIES = [
    { id: "all", name: "All Products" },
    { id: "djellaba", name: "Djellaba" },
    { id: "kaftan", name: "Kaftan & Takchita" },
    { id: "jabador", name: "Jabador" },
    { id: "babouche", name: "Babouche" },
]

type CategoryFilterProps = {
    'data-testid'?: string
}

export default function CategoryFilter({ 'data-testid': dataTestId }: CategoryFilterProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const currentCategory = searchParams.get("category") || "all"
    const currentGender = searchParams.get("gender") || "all"

    const updateFilters = useCallback((updates: { category?: string; gender?: string }) => {
        const params = new URLSearchParams(searchParams.toString())

        if (updates.category !== undefined) {
            if (updates.category === "all") {
                params.delete("category")
            } else {
                params.set("category", updates.category)
            }
        }

        if (updates.gender !== undefined) {
            if (updates.gender === "all") {
                params.delete("gender")
            } else {
                params.set("gender", updates.gender)
            }
        }

        // Reset to page 1 when changing filters
        params.delete("page")

        const queryString = params.toString()
        router.push(queryString ? `${pathname}?${queryString}` : pathname)
    }, [pathname, router, searchParams])

    return (
        <div className="mb-8 space-y-6" data-testid={dataTestId}>
            {/* Gender Toggle */}
            <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
                    Shop For
                </h3>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    {[
                        { id: "all", label: "All" },
                        { id: "Women", label: "Women" },
                        { id: "Men", label: "Men" },
                    ].map((option) => (
                        <button
                            key={option.id}
                            onClick={() => updateFilters({ gender: option.id })}
                            className={clx(
                                "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                                currentGender === option.id
                                    ? "bg-[#d4af37] text-white shadow-md"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                            )}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Category Dropdown */}
            <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
                    Category
                </h3>
                <div className="relative">
                    <select
                        value={currentCategory}
                        onChange={(e) => updateFilters({ category: e.target.value })}
                        className="w-full appearance-none bg-white border-2 border-[#d4af37]/30 rounded-xl px-4 py-3 pr-10 text-gray-800 font-medium focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all cursor-pointer hover:border-[#d4af37]/50"
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    {/* Dropdown Arrow */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg
                            className="w-5 h-5 text-[#d4af37]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Active Filters Display */}
            {(currentCategory !== "all" || currentGender !== "all") && (
                <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 uppercase tracking-wider">Active Filters</span>
                        <button
                            onClick={() => updateFilters({ category: "all", gender: "all" })}
                            className="text-xs text-[#d4af37] hover:text-[#b8963e] font-medium"
                        >
                            Clear All
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {currentGender !== "all" && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#d4af37]/10 text-[#8b7355] rounded-full text-sm">
                                {currentGender}
                                <button
                                    onClick={() => updateFilters({ gender: "all" })}
                                    className="ml-1 hover:text-[#d4af37]"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        {currentCategory !== "all" && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#d4af37]/10 text-[#8b7355] rounded-full text-sm">
                                {CATEGORIES.find(c => c.id === currentCategory)?.name}
                                <button
                                    onClick={() => updateFilters({ category: "all" })}
                                    className="ml-1 hover:text-[#d4af37]"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

"use client"

import { useState, useMemo } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"

// Categories
const CATEGORIES = [
    { id: "all", name: "All Products" },
    { id: "djellaba", name: "Djellaba" },
    { id: "kaftan", name: "Kaftan" },
    { id: "jabador", name: "Jabador" },
    { id: "babouche", name: "Babouche" },
]

// Explicit product mapping - from user's list
// This ensures RELIABLE filtering regardless of metadata
const PRODUCT_MAP: Record<string, { gender: "Men" | "Women"; category: string }> = {
    // Women's products
    "kaftan-royal-marocain": { gender: "Women", category: "kaftan" },
    "kaftan royal marocain": { gender: "Women", category: "kaftan" },
    "djellaba-femme-elegante": { gender: "Women", category: "djellaba" },
    "djellaba femme élégante": { gender: "Women", category: "djellaba" },
    "golden-bridal-takchita": { gender: "Women", category: "kaftan" },
    "golden bridal takchita": { gender: "Women", category: "kaftan" },
    "traditional-cream-djellaba": { gender: "Women", category: "djellaba" },
    "traditional cream djellaba": { gender: "Women", category: "djellaba" },
    "navy-wool-djellaba": { gender: "Women", category: "djellaba" },
    "navy wool djellaba": { gender: "Women", category: "djellaba" },
    "burgundy-silk-kaftan": { gender: "Women", category: "kaftan" },
    "burgundy silk kaftan": { gender: "Women", category: "kaftan" },
    "emerald-velvet-kaftan": { gender: "Women", category: "kaftan" },
    "emerald velvet kaftan": { gender: "Women", category: "kaftan" },
    // Men's products
    "djellaba-homme-traditionnelle": { gender: "Men", category: "djellaba" },
    "djellaba homme traditionnelle": { gender: "Men", category: "djellaba" },
    "babouche-cuir-fes": { gender: "Men", category: "babouche" },
    "babouche cuir fès": { gender: "Men", category: "babouche" },
    "classic-white-jabador": { gender: "Men", category: "jabador" },
    "classic white jabador": { gender: "Men", category: "jabador" },
}

// Get product info from map or metadata
function getProductInfo(p: HttpTypes.StoreProduct): { gender: string; category: string } | null {
    // Try handle first (most reliable)
    const handleLower = p.handle?.toLowerCase() ?? ""
    if (PRODUCT_MAP[handleLower]) return PRODUCT_MAP[handleLower]

    // Try title
    const titleLower = p.title?.toLowerCase() ?? ""
    if (PRODUCT_MAP[titleLower]) return PRODUCT_MAP[titleLower]

    // Try metadata
    const metaGender = p.metadata?.gender as string
    const metaCategory = p.metadata?.category as string
    if (metaGender && metaCategory) {
        return { gender: metaGender, category: metaCategory.toLowerCase() }
    }

    // Fallback: guess from title patterns
    const isWomen = titleLower.includes("kaftan") || titleLower.includes("takchita") ||
        titleLower.includes("femme") || titleLower.includes("bridal") ||
        titleLower.includes("women") || titleLower.includes("silk") ||
        titleLower.includes("velvet") || titleLower.includes("cream") ||
        titleLower.includes("navy wool")
    const isMen = titleLower.includes("homme") || titleLower.includes("men") ||
        titleLower.includes("babouche cuir") || titleLower.includes("jabador") ||
        titleLower.includes("white jabador")

    let category = "all"
    if (titleLower.includes("djellaba")) category = "djellaba"
    else if (titleLower.includes("kaftan") || titleLower.includes("takchita")) category = "kaftan"
    else if (titleLower.includes("jabador")) category = "jabador"
    else if (titleLower.includes("babouche")) category = "babouche"

    return { gender: isMen ? "Men" : "Women", category }
}

type Props = {
    products: HttpTypes.StoreProduct[]
    region: HttpTypes.StoreRegion
}

export default function ClientSideStore({ products, region }: Props) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const gender = (searchParams.get("gender") as "Men" | "Women") || "Women"
    const category = searchParams.get("category") || "all"

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set(key, value)
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }

    // Filter using explicit product map
    const filtered = useMemo(() => {
        if (!products?.length) return []

        return products.filter((p) => {
            const info = getProductInfo(p)
            if (!info) return false

            // Gender filter
            if (info.gender !== gender) return false

            // Category filter
            if (category !== "all" && info.category !== category) return false

            return true
        })
    }, [products, gender, category])

    return (
        <div className="py-6 content-container">
            <div className="flex flex-col small:flex-row small:items-start gap-8">

                {/* Filters Sidebar */}
                <div className="small:min-w-[280px] small:max-w-[280px]">
                    <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm sticky top-24">

                        {/* Gender Toggle */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
                                Shop For
                            </h3>
                            <div className="flex bg-gray-100 p-1 rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => updateFilter("gender", "Women")}
                                    className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${gender === "Women"
                                        ? "bg-[#d4af37] text-white shadow-md"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                                        }`}
                                >
                                    Women
                                </button>
                                <button
                                    type="button"
                                    onClick={() => updateFilter("gender", "Men")}
                                    className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${gender === "Men"
                                        ? "bg-[#d4af37] text-white shadow-md"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                                        }`}
                                >
                                    Men
                                </button>
                            </div>
                        </div>

                        {/* Category Dropdown */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
                                Category
                            </h3>
                            <div className="relative">
                                <select
                                    value={category}
                                    onChange={(e) => updateFilter("category", e.target.value)}
                                    className="w-full appearance-none bg-white border-2 border-[#d4af37]/30 rounded-xl px-4 py-3 pr-10 text-gray-800 font-medium focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all cursor-pointer hover:border-[#d4af37]/50"
                                >
                                    {CATEGORIES.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-5 h-5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Results Count */}
                        <div className="pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                                Showing <span className="font-semibold text-gray-900">{filtered.length}</span> of {products?.length ?? 0} products
                            </p>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="flex-1">
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            {gender}&apos;s {CATEGORIES.find(c => c.id === category)?.name ?? "Products"}
                        </h1>
                        <p className="text-gray-500 mt-1">Authentic Moroccan traditional clothing</p>
                    </div>

                    {filtered.length > 0 ? (
                        <div className="grid grid-cols-2 small:grid-cols-3 gap-x-6 gap-y-8">
                            {filtered.map((product) => (
                                <ProductPreview key={product.id} product={product} region={region} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-gray-50 rounded-xl">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                            <p className="text-gray-500 mt-1">No {category === "all" ? "products" : category} available for {gender}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

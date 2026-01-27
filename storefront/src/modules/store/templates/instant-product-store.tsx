"use client"

import { useState, useMemo, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import ProductPreview from "@modules/products/components/product-preview"
import { motion, AnimatePresence } from "framer-motion"

// Custom specific icons for traditional Moroccan clothes
const Icons = {
    Djellaba: (props: any) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v19M8 21h8a2 2 0 002-2V9a2 2 0 00-2-2h-3l-1-4-1 4H8a2 2 0 00-2 2v10a2 2 0 002 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3L9 7h6l-3-4z" />
        </svg>
    ),
    Kaftan: (props: any) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4L8 8v13h8V8l-4-4z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 8H4v8h4M16 8h4v8h-4" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v12" />
        </svg>
    ),
    Jabadour: (props: any) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3h6l2 4v7h-2v7h-2v-7h-2v7H9v-7H7V7l2-4z" />
        </svg>
    ),
    Babouche: (props: any) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 16c2.5 0 6-2 6-5s-3-4-6-4H6c-2.5 0-4 1.5-4 4s2 5 5 5h7z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 12V7" />
        </svg>
    ),
    All: (props: any) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
    ),
}

type Props = {
    initialProducts: HttpTypes.StoreProduct[]
    region: HttpTypes.StoreRegion
}

// Categories configuration
const CATEGORIES = [
    { id: "all", name: "All Products", icon: Icons.All },
    { id: "djellaba", name: "Djellaba", icon: Icons.Djellaba },
    { id: "kaftan", name: "Kaftan", icon: Icons.Kaftan }, // Includes Takchita
    { id: "jabadour", name: "Jabadour", icon: Icons.Jabadour },
    { id: "babouche", name: "Babouche", icon: Icons.Babouche },
]

export default function InstantProductStore({ initialProducts, region }: Props) {
    const [selectedGender, setSelectedGender] = useState<"Men" | "Women">("Women") // Default to Women
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [isAnimating, setIsAnimating] = useState(false)

    // Filter Logic
    const filteredProducts = useMemo(() => {
        return initialProducts.filter((product) => {
            // 1. Gender Filter (Check metadata, title, tags)
            const genderMatch = (() => {
                const metaGender = (product.metadata?.gender as string)?.toLowerCase()
                const titleLower = product.title.toLowerCase()

                if (selectedGender === "Men") {
                    return (
                        metaGender === "men" ||
                        titleLower.includes("men") ||
                        titleLower.includes("homme") ||
                        (titleLower.includes("jabadour") && !titleLower.includes("femme")) // Jabadour usually men unless specified
                    )
                } else {
                    // Women
                    return (
                        metaGender === "women" ||
                        titleLower.includes("women") ||
                        titleLower.includes("femme") ||
                        titleLower.includes("takchita") || // Takchita always women
                        titleLower.includes("kaftan")      // Kaftan usually women
                    )
                }
            })()

            if (!genderMatch) return false

            // 2. Category Filter
            if (selectedCategory === "all") return true

            const searchTerms = (() => {
                if (selectedCategory === "kaftan") return ["kaftan", "takchita", "robe"]
                if (selectedCategory === "babouche") return ["babouche", "balgha", "belgha", "slippers"]
                return [selectedCategory]
            })()

            const termMatch = searchTerms.some(term => {
                const t = term.toLowerCase()
                return (
                    product.title?.toLowerCase().includes(t) ||
                    product.handle?.toLowerCase().includes(t) ||
                    product.description?.toLowerCase().includes(t) ||
                    product.metadata?.category?.toString().toLowerCase().includes(t)
                )
            })

            return termMatch
        })
    }, [initialProducts, selectedGender, selectedCategory])

    // Handle Category Change
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setIsAnimating(true)
        setSelectedCategory(e.target.value)
        setTimeout(() => setIsAnimating(false), 300)
    }

    return (
        <div className="w-full">
            {/* Top Filter Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 bg-white p-6 rounded-xl border border-amber-100 shadow-sm sticky top-24 z-30">

                {/* Gender Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {["Women", "Men"].map((gender) => (
                        <button
                            key={gender}
                            onClick={() => setSelectedGender(gender as "Men" | "Women")}
                            className={clx(
                                "px-8 py-2.5 rounded-md text-sm font-medium transition-all duration-300",
                                selectedGender === gender
                                    ? "bg-white text-amber-900 shadow-sm ring-1 ring-black/5 scale-[1.02]"
                                    : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            {gender}
                        </button>
                    ))}
                </div>

                {/* Category Dropdown with Icons */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <span className="text-sm font-medium text-gray-500 whitespace-nowrap">Category:</span>
                    <div className="relative w-full md:w-64">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-amber-600">
                            {CATEGORIES.find(c => c.id === selectedCategory)?.icon({ className: "w-5 h-5" })}
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            className="w-full pl-10 pr-10 py-3 appearance-none bg-amber-50/50 border border-amber-200 rounded-lg text-amber-900 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none cursor-pointer font-medium hover:bg-amber-50 transition-colors"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-amber-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Title */}
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-serif text-gray-900">
                        {selectedGender} - {CATEGORIES.find(c => c.id === selectedCategory)?.name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Showing {filteredProducts.length} authentic handcrafted items
                    </p>
                </div>
            </div>

            {/* Product Grid */}
            <AnimatePresence mode="wait">
                {filteredProducts.length > 0 ? (
                    <motion.div
                        key={`${selectedGender}-${selectedCategory}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
                    >
                        {filteredProducts.map((product) => (
                            <ProductPreview key={product.id} product={product} region={region} />
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl"
                    >
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                        <p className="text-gray-500 mt-1">Try changing the category or gender filter</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

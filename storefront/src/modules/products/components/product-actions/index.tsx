"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import SizingCalculator from "@modules/products/components/sizing-calculator"
import { isEqual } from "lodash"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { useRouter } from "next/navigation"

// Sizing profile interface - Bach n-loado l-sizing li saved
interface SizingProfile {
  chest: number
  waist?: number
  hips?: number
  height?: number
  recommendedSize: string
  updatedAt: string
}

const SIZING_STORAGE_KEY = "tmurt_sizing_profile"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: { option_id: string; value: string }) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [isSizingOpen, setIsSizingOpen] = useState(false)
  const [savedSizing, setSavedSizing] = useState<SizingProfile | null>(null)
  const countryCode = useParams().countryCode as string

  // N-choufo wach l-product fih l-option dyal size/taille
  const sizeOption = useMemo(() => {
    return product.options?.find(
      (opt) => opt.title?.toLowerCase() === "size" || opt.title?.toLowerCase() === "taille"
    )
  }, [product.options])

  // N-loado saved sizing men localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SIZING_STORAGE_KEY)
      if (stored) {
        const profile = JSON.parse(stored) as SizingProfile
        setSavedSizing(profile)
      }
    } catch (err) {
      console.error("Ma9derch n-loadi sizing:", err)
    }
  }, [])

  // Auto-select saved size mlli kat-loadi l-page
  useEffect(() => {
    if (savedSizing && sizeOption && Object.keys(options).length === 0) {
      const sizeValues = sizeOption.values || []
      const matchingSize = sizeValues.find(
        (v: { value?: string }) => v.value?.toUpperCase() === savedSizing.recommendedSize?.toUpperCase()
      )
      if (matchingSize) {
        setOptions((prev) => ({
          ...prev,
          [sizeOption.id]: matchingSize.value,
        }))
      }
    }
  }, [savedSizing, sizeOption])

  // Ila kan variant wahed, n-selegssioniwh direct
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // N-bdelo l-options mli n-khtaro variant
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  // N-ta3amlo m3a l-size li t-calcula men l-hssaba
  const handleSizeCalculated = (recommendedSize: string) => {
    if (sizeOption) {
      // N-lqaw l-size l-monassib men l-options
      const sizeValues = sizeOption.values || []
      const matchingSize = sizeValues.find(
        (v: { value?: string }) => v.value?.toUpperCase() === recommendedSize.toUpperCase()
      )
      if (matchingSize) {
        setOptionValue(sizeOption.id, matchingSize.value)
      }
    }
  }

  // N-t'akkdo wach l-options li khtarina kay3tiw variant s7i7
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = isValidVariant ? selectedVariant?.id : null

    if (params.get("v_id") === value) {
      return
    }

    if (value) {
      params.set("v_id", value)
    } else {
      params.delete("v_id")
    }

    router.replace(pathname + "?" + params.toString())
  }, [selectedVariant, isValidVariant])

  // N-choufo wach variant kayn f stock
  const inStock = useMemo(() => {
    // Baqi ma khtarna ta variant, manqdrouch n3arfo stock
    if (!selectedVariant) {
      return false
    }

    // Ila ma-kunnach kan-jeriw stock, rah kayn
    if (!selectedVariant.manage_inventory) {
      return true
    }

    // Ila kan backorder masmouh, nqdro n-zidoh l cart
    if (selectedVariant.allow_backorder) {
      return true
    }

    // N-choufo ch7al kayn - API kat3tina hadchi
    const inventoryQty = selectedVariant.inventory_quantity
    if (typeof inventoryQty === 'number' && inventoryQty > 0) {
      return true
    }

    // Sinon, manqdrouch nziidoh
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // N-zido variant l cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    await addToCart({
      variantId: selectedVariant.id,
      quantity: 1,
      countryCode,
    })

    setIsAdding(false)
  }

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option) => {
                const isSizeOption =
                  option.title?.toLowerCase() === "size" ||
                  option.title?.toLowerCase() === "taille"

                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                    {/* Bouton bash t-lqa l-taille dyalek + Badge dyal saved size */}
                    {isSizeOption && (
                      <div className="mt-2 flex items-center gap-3 flex-wrap">
                        {/* Saved size badge */}
                        {savedSizing && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            Your size: <strong>{savedSizing.recommendedSize}</strong>
                          </span>
                        )}
                        {/* Find Size button */}
                        <button
                          type="button"
                          onClick={() => setIsSizingOpen(true)}
                          className="flex items-center gap-2 text-sm text-[#b8963e] hover:text-[#d4af37] transition-colors group"
                        >
                          <svg
                            className="w-4 h-4 transition-transform group-hover:scale-110"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                            />
                          </svg>
                          <span className="underline underline-offset-2">
                            {savedSizing ? "Update Measurements" : "Find My Size / اعرف مقاسك"}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
              <Divider />
            </div>
          )}
        </div>

        <ProductPrice product={product} variant={selectedVariant} />

        <Button
          onClick={handleAddToCart}
          disabled={
            !inStock ||
            !selectedVariant ||
            !!disabled ||
            isAdding ||
            !isValidVariant
          }
          variant="primary"
          className="w-full h-10"
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          {!selectedVariant && !options
            ? "Select variant"
            : !inStock || !isValidVariant
              ? "Out of stock"
              : "Add to cart"}
        </Button>
        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>

      {/* Sizing Calculator Modal */}
      <SizingCalculator
        isOpen={isSizingOpen}
        onClose={() => setIsSizingOpen(false)}
        onSizeCalculated={handleSizeCalculated}
        productType={product.type?.value || "clothing"}
      />
    </>
  )
}

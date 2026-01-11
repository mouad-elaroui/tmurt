import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div
        data-testid="product-wrapper"
        className="relative overflow-hidden rounded-lg bg-white border border-gray-100 hover:border-[#d4af37]/50 transition-all duration-300 hover:shadow-lg group"
      >
        {/* Thumbnail Container with Moroccan Corner Accents */}
        <div className="relative overflow-hidden">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
          />

          {/* Hover Overlay with Gold Accent */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Corner Decorations */}
          <div className="absolute top-0 left-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg viewBox="0 0 32 32" className="w-full h-full text-[#d4af37]">
              <path d="M0 0 L16 0 L16 3 L3 3 L3 16 L0 16 Z" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rotate-90">
            <svg viewBox="0 0 32 32" className="w-full h-full text-[#d4af37]">
              <path d="M0 0 L16 0 L16 3 L3 3 L3 16 L0 16 Z" fill="currentColor" />
            </svg>
          </div>

          {/* Quick View Badge (appears on hover) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-[#8b7355] text-sm font-medium rounded-full shadow-lg border border-[#d4af37]/30">
              View Details
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="flex justify-between items-start gap-2">
            <Text
              className="text-gray-700 font-medium group-hover:text-[#8b7355] transition-colors line-clamp-2"
              data-testid="product-title"
            >
              {product.title}
            </Text>
            <div className="flex flex-col items-end shrink-0">
              {cheapestPrice && (
                <div className="text-[#b8963e] font-semibold">
                  <PreviewPrice price={cheapestPrice} />
                </div>
              )}
            </div>
          </div>

          {/* Subtle Gold Underline */}
          <div className="mt-3 h-0.5 w-0 bg-gradient-to-r from-[#d4af37] to-[#b8963e] group-hover:w-full transition-all duration-300" />
        </div>

        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-gradient-to-r from-[#d4af37] to-[#b8963e] text-white text-xs font-medium rounded-full shadow-sm">
              Featured
            </span>
          </div>
        )}
      </div>
    </LocalizedClientLink>
  )
}

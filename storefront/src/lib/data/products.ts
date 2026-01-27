"use server"

import { sdk } from "@lib/config"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          limit,
          offset,
          region_id: region?.id,
          fields:
            "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,",
          ...queryParams,
        },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
}

/**
 * Filter products by category slug - matches product title, handle, or tags
 */
const filterProductsByCategory = (
  products: HttpTypes.StoreProduct[],
  categorySlug?: string
): HttpTypes.StoreProduct[] => {
  if (!categorySlug || categorySlug === "all") {
    return products
  }

  // Map category slug to search terms
  // Example: "kaftan" should match "kaftan" OR "takchita"
  // "babouche" should match "babouche" OR "balgha"
  const getSearchTerms = (slug: string): string[] => {
    const term = slug.toLowerCase()

    if (term === "kaftan") {
      return ["kaftan", "takchita"]
    }

    if (term === "babouche") {
      return ["babouche", "balgha", "belgha"]
    }

    return [term]
  }

  const searchTerms = getSearchTerms(categorySlug)

  return products.filter((product) => {
    return searchTerms.some(term => {
      // Check product title
      const titleMatch = product.title?.toLowerCase().includes(term)

      // Check product handle/slug
      const handleMatch = product.handle?.toLowerCase().includes(term)

      // Check product description
      const descMatch = product.description?.toLowerCase().includes(term)

      // Check product tags
      const tagsMatch = product.tags?.some((tag: any) =>
        tag.value?.toLowerCase().includes(term)
      )

      // Check metadata
      const metaMatch = product.metadata?.category?.toString().toLowerCase().includes(term)

      return titleMatch || handleMatch || descMatch || tagsMatch || metaMatch
    })
  })
}

/**
 * Filter products by gender from metadata
 */
const filterProductsByGender = (
  products: HttpTypes.StoreProduct[],
  genderFilter?: string
): HttpTypes.StoreProduct[] => {
  if (!genderFilter || genderFilter === "all") {
    return products
  }

  return products.filter((product) => {
    const productGender = (product.metadata?.gender as string)?.toLowerCase()
    const filterGender = genderFilter.toLowerCase()

    // Check metadata
    if (productGender === filterGender) return true

    // Fallback: check title for "men's" or "women's"
    const title = product.title?.toLowerCase() || ""
    if (filterGender === "men" && (title.includes("men") || title.includes("homme"))) return true
    if (filterGender === "women" && (title.includes("women") || title.includes("femme"))) return true

    return false
  })
}

/**
 * Fetch products with sorting, category, and gender filtering.
 */
export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
  categorySlug,
  genderFilter,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string
  categorySlug?: string
  genderFilter?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12

  const {
    response: { products },
  } = await listProducts({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      limit: 100,
    },
    countryCode,
  })

  // Filter by category
  let filteredProducts = filterProductsByCategory(products, categorySlug)

  // Filter by gender
  filteredProducts = filterProductsByGender(filteredProducts, genderFilter)

  const count = filteredProducts.length

  const sortedProducts = sortProducts(filteredProducts, sortBy)

  const pageParam = (page - 1) * limit

  const nextPage = count > pageParam + limit ? pageParam + limit : null

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

  return {
    response: {
      products: paginatedProducts,
      count,
    },
    nextPage,
    queryParams,
  }
}

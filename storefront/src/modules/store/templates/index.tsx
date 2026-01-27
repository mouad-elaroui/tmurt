import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  category,
  gender,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  category?: string
  gender?: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  // Map category slug to display title
  const getCategoryTitle = (cat?: string, gen?: string) => {
    const categoryTitles: Record<string, string> = {
      djellaba: "Djellaba",
      kaftan: "Kaftan & Takchita",
      jabador: "Jabador",
      babouche: "Babouche",
    }

    const genderPrefix = gen && gen !== "all" ? `${gen}'s ` : ""
    const categoryName = cat ? categoryTitles[cat] || "Products" : "All Products"

    return genderPrefix + categoryName
  }

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <RefinementList sortBy={sort} />
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-2xl-semi" data-testid="store-page-title">
            {getCategoryTitle(category, gender)}
          </h1>
          <p className="text-gray-500 mt-1">
            Discover our authentic Moroccan traditional clothing collection
          </p>
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            categorySlug={category}
            genderFilter={gender}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate

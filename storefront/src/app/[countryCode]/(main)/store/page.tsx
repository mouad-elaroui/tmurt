import { Suspense } from "react"
import { Metadata } from "next"
import { getRegion } from "@lib/data/regions"
import { listProducts } from "@lib/data/products"
import ClientSideStore from "@modules/store/templates/client-side-store"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our authentic Moroccan traditional clothing.",
}

type Params = {
  params: Promise<{
    countryCode: string
  }>
}

// Loading skeleton
function StoreLoading() {
  return (
    <div className="py-6 content-container">
      <div className="flex flex-col small:flex-row small:items-start gap-8">
        <div className="small:min-w-[280px] small:max-w-[280px]">
          <div className="bg-gray-100 rounded-2xl h-64 animate-pulse" />
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-2 small:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function StorePage(props: Params) {
  const params = await props.params
  const countryCode = params.countryCode

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // Fetch ALL products for client-side filtering
  const { response: { products } } = await listProducts({
    pageParam: 1,
    queryParams: {
      limit: 100,
    },
    countryCode,
  })

  return (
    <Suspense fallback={<StoreLoading />}>
      <ClientSideStore
        products={products}
        region={region}
      />
    </Suspense>
  )
}

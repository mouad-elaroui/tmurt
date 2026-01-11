import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import StoreTemplate from "@modules/store/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

export const metadata: Metadata = {
  title: "Tmurt - تمورت | Authentic Amazigh Traditional Clothing",
  description: "Discover handcrafted traditional Moroccan garments. Kaftans, Djellabas, Takchitas, and more delivered across Morocco.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function Home(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page } = searchParams

  return (
    <>
      {/* Moroccan Hero Section - L-header dial l-website b l-style Meghribi */}
      <Hero />

      {/* Store Products Grid */}
      <StoreTemplate
        sortBy={sortBy}
        page={page}
        countryCode={params.countryCode}
      />
    </>
  )
}

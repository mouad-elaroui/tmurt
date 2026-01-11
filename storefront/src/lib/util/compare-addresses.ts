// Type dyal address bach n-compariw
interface Address {
  first_name?: string
  last_name?: string
  address_1?: string
  company?: string
  postal_code?: string
  city?: string
  country_code?: string
  province?: string
  phone?: string
}

import { isEqual, pick } from "lodash"

// Kan-compariw bin 2 addresses
export default function compareAddresses(address1: Address | null | undefined, address2: Address | null | undefined): boolean {
  return isEqual(
    pick(address1, [
      "first_name",
      "last_name",
      "address_1",
      "company",
      "postal_code",
      "city",
      "country_code",
      "province",
      "phone",
    ]),
    pick(address2, [
      "first_name",
      "last_name",
      "address_1",
      "company",
      "postal_code",
      "city",
      "country_code",
      "province",
      "phone",
    ])
  )
}

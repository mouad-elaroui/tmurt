/**
 * Update Store Name Script
 * Updates the default store name from "Medusa Store" to "Tmurt"
 */

import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function updateStoreName({ container }: ExecArgs) {
    const storeService = container.resolve("store")

    // Fetch the default store
    const [store] = await storeService.listStores()

    if (store) {
        await storeService.updateStores(store.id, {
            name: "Tmurt"
        })
        console.log(`✅ Store name updated to: Tmurt`)
    } else {
        console.log("⚠️ No store found to update")
    }
}

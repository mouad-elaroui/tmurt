import { Module } from "@medusajs/framework/utils"
import { FamilySyncService } from "./service"

// Module dial l-family sync - l-shopping dial l-3a2ila
export const FAMILY_SYNC_MODULE = "familySync"

export default Module(FAMILY_SYNC_MODULE, {
    service: FamilySyncService,
})

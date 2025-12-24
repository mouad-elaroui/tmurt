import { Module } from "@medusajs/framework/utils"
import { SizingService } from "./service"

export const SIZING_MODULE = "sizing"

export default Module(SIZING_MODULE, {
    service: SizingService,
})

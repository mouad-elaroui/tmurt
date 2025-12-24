import { Module } from "@medusajs/framework/utils"
import { DigitalPassportService } from "./service"

export const DIGITAL_PASSPORT_MODULE = "digital-passport"

export default Module(DIGITAL_PASSPORT_MODULE, {
    service: DigitalPassportService,
})

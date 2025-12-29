import { Module } from "@medusajs/framework/utils"
import { DigitalPassportService } from "./service"

export const DIGITAL_PASSPORT_MODULE = "digital_passport"

export default Module(DIGITAL_PASSPORT_MODULE, {
    service: DigitalPassportService,
})

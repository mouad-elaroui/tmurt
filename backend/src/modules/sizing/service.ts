import { MedusaService } from "@medusajs/framework/utils"
import { SizingData } from "./models/sizing-data"

export class SizingService extends MedusaService({
    SizingData,
}) {
    // Service bach n-traitiw l-measurements w n-calculiw size recommendation

    calculateSize(measurements: Record<string, number>): { size: string; details: string } {
        // Hna fin kan-7sbo l-taille l-monasiba

        const { chest } = measurements
        let size = "Unknown"
        let details = "Please provide chest measurements"

        if (chest) {
            if (chest < 88) {
                size = "XS"
                details = "Based on chest size < 88cm"
            } else if (chest >= 88 && chest < 96) {
                size = "S"
                details = "Based on chest size 88-96cm"
            } else if (chest >= 96 && chest < 104) {
                size = "M"
                details = "Based on chest size 96-104cm"
            } else if (chest >= 104 && chest < 112) {
                size = "L"
                details = "Based on chest size 104-112cm"
            } else if (chest >= 112 && chest < 124) {
                size = "XL"
                details = "Based on chest size 112-124cm"
            } else {
                size = "XXL"
                details = "Based on chest size > 124cm"
            }
        }

        // Return l-natija final
        return { size, details }
    }
}

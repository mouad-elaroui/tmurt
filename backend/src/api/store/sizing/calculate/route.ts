
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SIZING_MODULE } from "../../../../modules/sizing"
import { SizingService } from "../../../../modules/sizing/service"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const sizingService: SizingService = req.scope.resolve(SIZING_MODULE)

    // Hna fin kan-recuperiw data mn l-request request
    const measurements = req.body as Record<string, number>

    if (!measurements) {
        res.status(400).json({ message: "Measurements are required" })
        return
    }

    // Hna kan-3ayto 3la l-makina bach t-7seb l-taille
    const result = sizingService.calculateSize(measurements)

    res.json({
        recommended_size: result.size,
        details: result.details,
        measurements: measurements
    })
}

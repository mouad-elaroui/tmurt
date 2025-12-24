
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SIZING_MODULE } from "../../../modules/sizing"
import { SizingService } from "../../../modules/sizing/service"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const sizingService: SizingService = req.scope.resolve(SIZING_MODULE)
    // Hna kan-jebdo data dial sizing
    const [sizing_data, count] = await sizingService.listAndCountSizingDatas(req.query)

    res.json({
        sizing_data,
        count,
    })
}

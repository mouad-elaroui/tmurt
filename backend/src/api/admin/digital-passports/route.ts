
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { DIGITAL_PASSPORT_MODULE } from "../../../modules/digital-passport"
import { DigitalPassportService } from "../../../modules/digital-passport/service"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const passportService: DigitalPassportService = req.scope.resolve(DIGITAL_PASSPORT_MODULE)
    // Hna kan-jebdo la liste dial passports
    const [passports, count] = await passportService.listAndCountDigitalPassports(req.query)

    res.json({
        digital_passports: passports,
        count,
    })
}

import { Metadata } from "next"
import SizeCalculatorPage from "@modules/sizing/templates/size-calculator-page"

export const metadata: Metadata = {
    title: "Size Calculator | Tmurt",
    description: "Find your perfect size for traditional Moroccan clothing",
}

export default function SizeCalculator() {
    return <SizeCalculatorPage />
}

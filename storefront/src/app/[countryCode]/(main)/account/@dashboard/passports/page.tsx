import { Metadata } from "next"
import PassportsTemplate from "@modules/account/templates/passports-template"

export const metadata: Metadata = {
    title: "My Digital Passports",
    description: "View your product authenticity certificates",
}

export default function PassportsPage() {
    return <PassportsTemplate />
}

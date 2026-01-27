import { Metadata } from "next"
import PassportVerificationPage from "@modules/passport/components/passport-verification"

export const metadata: Metadata = {
    title: "Verify Product Authenticity | Tmurt",
    description: "Verify the authenticity of your Tmurt product with our digital passport system.",
}

type Props = {
    params: Promise<{
        countryCode: string
        tokenId: string
    }>
}

export default async function VerifyPage(props: Props) {
    const params = await props.params
    return <PassportVerificationPage tokenId={params.tokenId} />
}

import { Metadata } from "next"
import { WalletPage as WalletTemplate } from "@modules/account/components/wallet-overview"

export const metadata: Metadata = {
    title: "My Wallet",
    description: "View your wallet balance and transactions.",
}

export default function Wallet() {
    return <WalletTemplate />
}

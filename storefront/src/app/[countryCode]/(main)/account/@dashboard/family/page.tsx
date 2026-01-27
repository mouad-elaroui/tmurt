import { Metadata } from "next"
import FamilyHub from "@modules/account/components/family-hub"

export const metadata: Metadata = {
    title: "Family Hub | Tmurt",
    description: "Shop together with your family. Create groups, share wishlists, and discover products together.",
}

export default function FamilyPage() {
    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-2xl-semi mb-2">Family Hub</h1>
                <p className="text-gray-500">Shop together with your loved ones</p>
            </div>
            <FamilyHub />
        </div>
    )
}

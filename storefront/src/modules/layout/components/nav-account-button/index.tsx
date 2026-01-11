"use client"

import { useState } from "react"
import { AccountModal } from "@modules/account/components/account-modal"

export function NavAccountButton() {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="hover:text-[#d4af37] transition-colors font-medium"
                data-testid="nav-account-button"
            >
                Account
            </button>
            <AccountModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    )
}

export default NavAccountButton

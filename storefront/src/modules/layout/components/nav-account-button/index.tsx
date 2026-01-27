"use client"

import { useState } from "react"
import { AccountModal } from "@modules/account/components/account-modal"

export function NavAccountButton() {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="hover:text-[#d4af37] transition-colors font-medium flex items-center gap-2"
                data-testid="nav-account-button"
            >
                {/* User Icon - always visible */}
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                </svg>
                {/* Text - hidden on mobile, visible on desktop */}
                <span className="hidden small:inline">Account</span>
            </button>
            <AccountModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    )
}

export default NavAccountButton

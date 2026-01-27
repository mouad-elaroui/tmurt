"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export function NavWalletButton() {
    return (
        <LocalizedClientLink
            href="/account/wallet"
            className="hover:text-[#d4af37] transition-colors font-medium flex items-center gap-2"
            data-testid="nav-wallet-button"
        >
            {/* Wallet Icon - always visible */}
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
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
            </svg>
            {/* Text - hidden on mobile, visible on desktop */}
            <span className="hidden small:inline">Wallet</span>
        </LocalizedClientLink>
    )
}

export default NavWalletButton

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { XMark } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useScrollLock } from "@lib/hooks/use-scroll-lock"

interface AccountModalProps {
    isOpen: boolean
    onClose: () => void
}

export function AccountModal({ isOpen, onClose }: AccountModalProps) {
    useScrollLock(isOpen)
    const [mode, setMode] = useState<"login" | "register">("login")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: N-integréw l-auth dyal Medusa hna
        console.log("Form submitted:", { email, password, mode })
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* L-khalfiya */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
                    />

                    {/* L-container dyal modal - m-center b flexbox */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="fixed inset-0 z-[101] flex items-center justify-center p-4"
                    >
                        <div className="w-full max-w-md bg-[#fdfbf7] rounded-2xl shadow-2xl overflow-hidden border border-[#d4af37]/30" onClick={(e) => e.stopPropagation()}>
                            {/* Header */}
                            <div className="relative p-6 bg-gradient-to-r from-[#f9f3e8] to-[#f0e4cc] border-b border-[#d4af37]/20">
                                <div className="flex justify-center mb-4">
                                    <img src="/tmurt-logo.png" alt="Tmurt" className="h-16 object-contain" />
                                </div>
                                <h2
                                    className="text-2xl text-center text-[#4a3f2e]"
                                    style={{ fontFamily: '"Cinzel Decorative", Georgia, serif' }}
                                >
                                    {mode === "login" ? "Welcome Back" : "Join Tmurt"}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#d4af37]/10 text-[#8b7355] transition-colors"
                                >
                                    <XMark className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Formulaire */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {mode === "register" && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm text-[#6b5c4c] mb-1">First Name</label>
                                            <input
                                                type="text"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-lg border border-[#d4af37]/30 bg-white/50 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 outline-none transition-all"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-[#6b5c4c] mb-1">Last Name</label>
                                            <input
                                                type="text"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-lg border border-[#d4af37]/30 bg-white/50 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 outline-none transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm text-[#6b5c4c] mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full px-4 py-2.5 rounded-lg border border-[#d4af37]/30 bg-white/50 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 outline-none transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-[#6b5c4c] mb-1">Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2.5 rounded-lg border border-[#d4af37]/30 bg-white/50 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 outline-none transition-all"
                                        required
                                    />
                                </div>

                                {mode === "login" && (
                                    <div className="flex justify-end">
                                        <button type="button" className="text-sm text-[#d4af37] hover:underline">
                                            Forgot password?
                                        </button>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-gradient-to-r from-[#d4af37] to-[#b8963e] text-white font-medium rounded-lg hover:shadow-lg hover:shadow-[#d4af37]/30 transition-all"
                                    style={{ fontFamily: '"Cinzel Decorative", Georgia, serif' }}
                                >
                                    {mode === "login" ? "Sign In" : "Create Account"}
                                </button>
                            </form>

                            {/* Footer */}
                            <div className="px-6 pb-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-px bg-[#d4af37]/30 flex-1" />
                                    <span className="text-xs text-[#8b7355]">or</span>
                                    <div className="h-px bg-[#d4af37]/30 flex-1" />
                                </div>

                                <p className="text-center text-sm text-[#6b5c4c]">
                                    {mode === "login" ? (
                                        <>
                                            New to Tmurt?{" "}
                                            <button
                                                onClick={() => setMode("register")}
                                                className="text-[#d4af37] font-medium hover:underline"
                                            >
                                                Create an account
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            Already have an account?{" "}
                                            <button
                                                onClick={() => setMode("login")}
                                                className="text-[#d4af37] font-medium hover:underline"
                                            >
                                                Sign in
                                            </button>
                                        </>
                                    )}
                                </p>

                                {/* Kemmel bla ma t-sfejel */}
                                <LocalizedClientLink
                                    href="/account"
                                    onClick={onClose}
                                    className="block mt-4 text-center text-sm text-[#8b7355] hover:text-[#d4af37] transition-colors"
                                >
                                    Continue to account page →
                                </LocalizedClientLink>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

// Wrapper dyal buton dyal l-compte
export function AccountButton() {
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

export default AccountModal

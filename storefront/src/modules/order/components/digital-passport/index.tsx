"use client"

import { useEffect, useState } from "react"
import { Text, Heading, Container, clx } from "@medusajs/ui"
import { CheckCircleSolid } from "@medusajs/icons"

export default function DigitalPassport({ orderId }: { orderId: string }) {
    const [passport, setPassport] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Fetch passport directly from backend API
        const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
        fetch(`${backendUrl}/demo/generate-passport?order_id=${orderId}`)
            .then(res => res.json())
            .then(data => {
                if (data.passport) setPassport(data.passport)
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [orderId])

    if (loading) return null // Or skeleton

    if (!passport) return null

    return (
        <div className="mt-8 p-6 bg-amber-50 rounded-xl border border-amber-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-amber-900"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-x-2 mb-4">
                    <CheckCircleSolid className="text-amber-600" />
                    <Heading level="h3" className="text-amber-900 text-lg font-serif italic">Authentic Kmurt Craftsmanship</Heading>
                </div>

                <Text className="text-amber-800 mb-6 text-sm max-w-[80%]">
                    This product is verified on the blockchain. Your digital passport proves the authenticity and origin of your purchase.
                </Text>

                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-amber-200/50 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <Text className="font-mono text-[10px] uppercase text-amber-500 tracking-wider">Passive Token ID</Text>
                        <Text className="font-mono text-base text-amber-950 font-medium break-all">{passport.token_id || passport.token}</Text>
                    </div>

                    <div className="flex flex-col sm:text-right shrink-0">
                        <Text className="font-mono text-[10px] uppercase text-amber-500 tracking-wider">Status</Text>
                        <div className="flex items-center gap-x-1.5 sm:justify-end">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <Text className="font-bold text-green-700 text-xs tracking-wide">{passport.status || "VERIFIED"}</Text>
                        </div>
                    </div>
                </div>

                {passport.verify_url && (
                    <div className="mt-4 text-center sm:text-left">
                        <a href={passport.verify_url} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-600 hover:text-amber-800 underline transition-colors">
                            Verify on Blockchain Explorer &rarr;
                        </a>
                    </div>
                )}
            </div>
        </div>
    )
}

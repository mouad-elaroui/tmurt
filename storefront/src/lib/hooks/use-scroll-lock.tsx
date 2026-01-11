"use client"

import { useEffect } from "react"

// Hook bach n-locki scroll dyal background mlli modal mftouh
export const useScrollLock = (isLocked: boolean) => {
    useEffect(() => {
        if (!isLocked) return

        // N-savegardew l-position dyal scroll bach n-raj3oha mn ba3d
        const scrollY = window.scrollY
        const body = document.body

        // N-fixiw l-body f blasstha bach ma y-scrollich
        body.style.position = "fixed"
        body.style.top = `-${scrollY}px`
        body.style.left = "0"
        body.style.right = "0"
        body.style.overflow = "hidden"

        // Mlli modal y-tsad, n-raj3o kolshi kima kan
        return () => {
            body.style.position = ""
            body.style.top = ""
            body.style.left = ""
            body.style.right = ""
            body.style.overflow = ""
            // N-raj3o l-user l-position li kan fiha
            window.scrollTo(0, scrollY)
        }
    }, [isLocked])
}

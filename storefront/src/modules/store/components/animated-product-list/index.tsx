"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

// Staggered animation container for product lists
export const AnimatedProductList = ({
    children,
    className = "grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
}: {
    children: ReactNode
    className?: string
}) => {
    return (
        <motion.ul
            className={className}
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.08,
                        delayChildren: 0.1,
                    },
                },
            }}
            data-testid="products-list"
        >
            {children}
        </motion.ul>
    )
}

// Individual animated list item
export const AnimatedProductItem = ({
    children
}: {
    children: ReactNode
}) => {
    return (
        <motion.li
            variants={{
                hidden: {
                    opacity: 0,
                    y: 30,
                    scale: 0.95
                },
                visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                        duration: 0.5,
                        ease: [0.25, 0.1, 0.25, 1],
                    }
                },
            }}
            whileHover={{
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" }
            }}
        >
            {children}
        </motion.li>
    )
}

export default AnimatedProductList

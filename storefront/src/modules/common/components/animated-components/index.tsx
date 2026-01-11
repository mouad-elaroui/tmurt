"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface AnimatedProductCardProps {
    children: ReactNode
    index?: number
}

export const AnimatedProductCard = ({ children, index = 0 }: AnimatedProductCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            whileHover={{
                y: -8,
                transition: { duration: 0.3 }
            }}
            className="h-full"
        >
            {children}
        </motion.div>
    )
}

// Animated container for product grids with stagger effect
export const AnimatedProductGrid = ({ children }: { children: ReactNode }) => {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.08,
                    },
                },
            }}
            className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
        >
            {children}
        </motion.div>
    )
}

// Animated image with zoom on hover
export const AnimatedProductImage = ({
    src,
    alt,
    className = ""
}: {
    src: string
    alt: string
    className?: string
}) => {
    return (
        <motion.div
            className={`overflow-hidden ${className}`}
            whileHover="hover"
        >
            <motion.img
                src={src}
                alt={alt}
                className="w-full h-full object-cover"
                variants={{
                    hover: {
                        scale: 1.08,
                        transition: { duration: 0.4, ease: "easeOut" }
                    }
                }}
            />
        </motion.div>
    )
}

// Staggered fade-in for lists
export const AnimatedListItem = ({
    children,
    index = 0
}: {
    children: ReactNode
    index?: number
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
                duration: 0.4,
                delay: index * 0.05,
                ease: "easeOut"
            }}
        >
            {children}
        </motion.div>
    )
}

// Page transition wrapper
export const PageTransition = ({ children }: { children: ReactNode }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
        >
            {children}
        </motion.div>
    )
}

// Button with press animation
export const AnimatedButton = ({
    children,
    className = "",
    onClick
}: {
    children: ReactNode
    className?: string
    onClick?: () => void
}) => {
    return (
        <motion.button
            className={className}
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
        >
            {children}
        </motion.button>
    )
}

export default AnimatedProductCard

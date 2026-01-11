"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface MoroccanPatternProps {
    variant?: "corner" | "border" | "divider" | "background"
    position?: "top" | "bottom" | "left" | "right" | "all"
    className?: string
    animated?: boolean
    children?: ReactNode
}

// Decorative Moroccan pattern component - Tezyin Meghribi
export function MoroccanPattern({
    variant = "corner",
    position = "all",
    className = "",
    animated = true,
}: MoroccanPatternProps) {
    // SVG patterns inspired by Zellige tiles and Amazigh geometry
    const CornerPattern = ({ isTopLeft = false }: { isTopLeft?: boolean }) => (
        <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            className={`absolute ${isTopLeft ? "top-0 left-0" : "bottom-0 right-0 rotate-180"}`}
        >
            <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d4af37" />
                    <stop offset="100%" stopColor="#b8963e" />
                </linearGradient>
            </defs>
            <path
                d="M0 0 L40 0 L40 4 L4 4 L4 40 L0 40 Z"
                fill="url(#goldGradient)"
            />
            <path
                d="M8 8 L24 8 L24 10 L10 10 L10 24 L8 24 Z"
                fill="url(#goldGradient)"
                opacity="0.6"
            />
            <circle cx="6" cy="6" r="2" fill="url(#goldGradient)" />
        </svg>
    )

    const BorderPattern = () => (
        <div className="w-full flex items-center gap-2">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
            <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                    d="M12 0 L24 12 L12 24 L0 12 Z"
                    fill="none"
                    stroke="#d4af37"
                    strokeWidth="1.5"
                />
                <path
                    d="M12 6 L18 12 L12 18 L6 12 Z"
                    fill="#d4af37"
                    opacity="0.3"
                />
            </svg>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
        </div>
    )

    const DividerPattern = () => (
        <div className="w-full py-4">
            <div className="flex items-center justify-center gap-3">
                <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#d4af37]" />
                <svg width="16" height="16" viewBox="0 0 16 16">
                    <path d="M8 0 L16 8 L8 16 L0 8 Z" fill="#d4af37" />
                </svg>
                <svg width="12" height="12" viewBox="0 0 12 12">
                    <path d="M6 0 L12 6 L6 12 L0 6 Z" fill="#d4af37" opacity="0.5" />
                </svg>
                <svg width="16" height="16" viewBox="0 0 16 16">
                    <path d="M8 0 L16 8 L8 16 L0 8 Z" fill="#d4af37" />
                </svg>
                <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
        </div>
    )

    const Wrapper = animated ? motion.div : "div"
    const animationProps = animated
        ? {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.5 },
        }
        : {}

    if (variant === "corner") {
        return (
            <Wrapper className={`relative ${className}`} {...animationProps}>
                {(position === "all" || position === "top" || position === "left") && (
                    <CornerPattern isTopLeft />
                )}
                {(position === "all" || position === "bottom" || position === "right") && (
                    <CornerPattern isTopLeft={false} />
                )}
            </Wrapper>
        )
    }

    if (variant === "border") {
        return (
            <Wrapper className={className} {...animationProps}>
                <BorderPattern />
            </Wrapper>
        )
    }

    if (variant === "divider") {
        return (
            <Wrapper className={className} {...animationProps}>
                <DividerPattern />
            </Wrapper>
        )
    }

    return null
}

// Moroccan Card with decorative corners
interface MoroccanCardProps {
    children: ReactNode
    className?: string
    hoverable?: boolean
}

export function MoroccanCard({
    children,
    className = "",
    hoverable = true,
}: MoroccanCardProps) {
    return (
        <motion.div
            className={`
        relative bg-white rounded-xl p-6 
        border border-[rgba(212,175,55,0.2)]
        shadow-[0_4px_20px_rgba(0,0,0,0.05)]
        ${hoverable ? "hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-[rgba(212,175,55,0.4)]" : ""}
        transition-all duration-300
        ${className}
      `}
            whileHover={hoverable ? { y: -2 } : undefined}
        >
            <MoroccanPattern variant="corner" />
            {children}
        </motion.div>
    )
}

// Moroccan Section Header
interface MoroccanHeadingProps {
    children: ReactNode
    subtitle?: string
    centered?: boolean
    className?: string
}

export function MoroccanHeading({
    children,
    subtitle,
    centered = false,
    className = "",
}: MoroccanHeadingProps) {
    return (
        <motion.div
            className={`mb-8 ${centered ? "text-center" : ""} ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 relative inline-block">
                {children}
                <span className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-[#d4af37] to-[#b8963e] rounded-full" />
            </h2>
            {subtitle && (
                <p className="mt-4 text-gray-600 max-w-2xl">{subtitle}</p>
            )}
        </motion.div>
    )
}

// Gold Button with Moroccan styling
interface MoroccanButtonProps {
    children: ReactNode
    onClick?: () => void
    variant?: "primary" | "secondary" | "outline"
    size?: "sm" | "md" | "lg"
    className?: string
    disabled?: boolean
    type?: "button" | "submit" | "reset"
}

export function MoroccanButton({
    children,
    onClick,
    variant = "primary",
    size = "md",
    className = "",
    disabled = false,
    type = "button",
}: MoroccanButtonProps) {
    const sizeClasses = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
    }

    const variantClasses = {
        primary: `
      bg-gradient-to-r from-[#d4af37] to-[#b8963e] text-white
      hover:from-[#b8963e] hover:to-[#8b7355]
      shadow-[0_4px_15px_rgba(212,175,55,0.3)]
      hover:shadow-[0_6px_20px_rgba(212,175,55,0.4)]
    `,
        secondary: `
      bg-white text-[#8b7355] border-2 border-[#d4af37]
      hover:bg-[#fdfbf7]
    `,
        outline: `
      bg-transparent text-[#d4af37] border border-[#d4af37]
      hover:bg-[rgba(212,175,55,0.1)]
    `,
    }

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-lg font-medium
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
            whileHover={!disabled ? { scale: 1.02 } : undefined}
            whileTap={!disabled ? { scale: 0.98 } : undefined}
        >
            {children}
        </motion.button>
    )
}

export default MoroccanPattern

"use client"

import { ArrowRightMini } from "@medusajs/icons"
import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { motion } from "framer-motion"
import { MoroccanPattern } from "@modules/common/components/pattern"

const Hero = () => {
  return (
    <div className="min-h-[85vh] w-full relative overflow-hidden bg-gradient-to-br from-[#fdfbf7] via-[#f9f3e8] to-[#f0e4cc]">
      {/* Moroccan Pattern Background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.15'%3E%3Cpath d='M30 0l30 30-30 30L0 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative Corner Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 md:w-48 md:h-48">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#d4af37] opacity-60">
          <path
            d="M0 0 L100 0 L100 8 L8 8 L8 100 L0 100 Z"
            fill="currentColor"
          />
          <path
            d="M15 15 L60 15 L60 18 L18 18 L18 60 L15 60 Z"
            fill="currentColor"
            opacity="0.5"
          />
          <circle cx="10" cy="10" r="3" fill="currentColor" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-32 h-32 md:w-48 md:h-48 rotate-180">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#d4af37] opacity-60">
          <path
            d="M0 0 L100 0 L100 8 L8 8 L8 100 L0 100 Z"
            fill="currentColor"
          />
          <path
            d="M15 15 L60 15 L60 18 L18 18 L18 60 L15 60 Z"
            fill="currentColor"
            opacity="0.5"
          />
          <circle cx="10" cy="10" r="3" fill="currentColor" />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center h-full min-h-[85vh] px-6 md:px-12">
        {/* Moroccan Decorative Element Above Title */}
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#d4af37]" />
          <svg width="24" height="24" viewBox="0 0 24 24" className="text-[#d4af37]">
            <path d="M12 0 L24 12 L12 24 L0 12 Z" fill="currentColor" />
          </svg>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#d4af37]" />
        </motion.div>

        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <Heading
            level="h1"
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            <span className="bg-gradient-to-r from-[#8b7355] via-[#d4af37] to-[#8b7355] bg-clip-text text-transparent">
              Tmurt
            </span>
            <span className="mx-4 text-[#d4af37]">-</span>
            <span className="text-4xl md:text-6xl">تمورت</span>
          </Heading>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Heading
            level="h2"
            className="text-xl md:text-2xl text-[#6b5a42] font-normal mb-6"
          >
            Authentic Amazigh Traditional Clothing
          </Heading>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-xl mb-10"
        >
          <Text className="text-gray-600 text-lg">
            Discover our curated collection of handcrafted traditional Moroccan garments.
            Each piece tells a story of heritage, artistry, and timeless elegance.
          </Text>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <LocalizedClientLink href="/store">
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#b8963e] text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Shop Collection
              <ArrowRightMini />
            </motion.button>
          </LocalizedClientLink>
          <LocalizedClientLink href="/collections">
            <motion.button
              className="px-8 py-4 bg-white text-[#8b7355] font-medium rounded-lg border-2 border-[#d4af37] hover:bg-[#fdfbf7] transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              View Collections
            </motion.button>
          </LocalizedClientLink>
        </motion.div>

        {/* Bottom Decorative Divider */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <MoroccanPattern variant="divider" />
        </motion.div>
      </div>

      {/* Floating Decorative Elements */}
      <motion.div
        className="absolute top-1/4 left-8 w-4 h-4 bg-[#d4af37] rotate-45 opacity-40"
        animate={{
          y: [0, -15, 0],
          rotate: [45, 90, 45],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/3 right-12 w-6 h-6 border-2 border-[#d4af37] rotate-45 opacity-30"
        animate={{
          y: [0, 20, 0],
          rotate: [45, 0, 45],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 left-16 w-3 h-3 bg-[#b8963e] rotate-45 opacity-50"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
    </div>
  )
}

export default Hero

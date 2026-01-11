import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="border-t border-[#d4af37]/30 w-full bg-gradient-to-b from-[#fdfbf7] to-[#f0e4cc]">
      {/* Moroccan Pattern Divider */}
      <div className="w-full h-2 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-40" />

      <div className="content-container flex flex-col w-full">
        {/* Main Footer Content */}
        <div className="flex flex-col gap-y-6 xsmall:flex-row items-start justify-between py-20">
          {/* Brand Section */}
          <div className="flex flex-col gap-4">
            <LocalizedClientLink
              href="/"
              className="flex items-center gap-2 group"
            >
              <span className="text-3xl font-bold bg-gradient-to-r from-[#8b7355] via-[#d4af37] to-[#8b7355] bg-clip-text text-transparent">
                Tmurt
              </span>
              <span className="text-2xl text-[#b8963e]">تمورت</span>
            </LocalizedClientLink>
            <Text className="text-sm text-gray-600 max-w-xs">
              Authentic Amazigh traditional clothing. Handcrafted with love, delivered across Morocco.
            </Text>
            {/* Social Icons Placeholder */}
            <div className="flex gap-3 mt-2">
              {["instagram", "facebook", "twitter"].map((social) => (
                <div
                  key={social}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37]/10 to-[#b8963e]/10 border border-[#d4af37]/30 flex items-center justify-center hover:from-[#d4af37] hover:to-[#b8963e] hover:text-white transition-all cursor-pointer group"
                >
                  <svg className="w-5 h-5 text-[#8b7355] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
              ))}
            </div>
          </div>

          {/* Links Section */}
          <div className="text-small-regular gap-10 md:gap-x-16 grid grid-cols-2 sm:grid-cols-3">
            {productCategories && productCategories?.length > 0 && (
              <div className="flex flex-col gap-y-3">
                <span className="txt-small-plus font-medium text-[#8b7355] flex items-center gap-2">
                  <span className="w-4 h-px bg-[#d4af37]" />
                  Categories
                </span>
                <ul
                  className="grid grid-cols-1 gap-2"
                  data-testid="footer-categories"
                >
                  {productCategories?.slice(0, 6).map((c) => {
                    if (c.parent_category) {
                      return
                    }

                    const children =
                      c.category_children?.map((child) => ({
                        name: child.name,
                        handle: child.handle,
                        id: child.id,
                      })) || null

                    return (
                      <li
                        className="flex flex-col gap-2 text-gray-600 txt-small"
                        key={c.id}
                      >
                        <LocalizedClientLink
                          className={clx(
                            "hover:text-[#d4af37] transition-colors",
                            children && "font-medium"
                          )}
                          href={`/categories/${c.handle}`}
                          data-testid="category-link"
                        >
                          {c.name}
                        </LocalizedClientLink>
                        {children && (
                          <ul className="grid grid-cols-1 ml-3 gap-2">
                            {children &&
                              children.map((child) => (
                                <li key={child.id}>
                                  <LocalizedClientLink
                                    className="hover:text-[#d4af37] transition-colors"
                                    href={`/categories/${child.handle}`}
                                    data-testid="category-link"
                                  >
                                    {child.name}
                                  </LocalizedClientLink>
                                </li>
                              ))}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
            {collections && collections.length > 0 && (
              <div className="flex flex-col gap-y-3">
                <span className="txt-small-plus font-medium text-[#8b7355] flex items-center gap-2">
                  <span className="w-4 h-px bg-[#d4af37]" />
                  Collections
                </span>
                <ul
                  className={clx(
                    "grid grid-cols-1 gap-2 text-gray-600 txt-small",
                    {
                      "grid-cols-2": (collections?.length || 0) > 3,
                    }
                  )}
                >
                  {collections?.slice(0, 6).map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="hover:text-[#d4af37] transition-colors"
                        href={`/collections/${c.handle}`}
                      >
                        {c.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Help Section */}
            <div className="flex flex-col gap-y-3">
              <span className="txt-small-plus font-medium text-[#8b7355] flex items-center gap-2">
                <span className="w-4 h-px bg-[#d4af37]" />
                Help
              </span>
              <ul className="grid grid-cols-1 gap-2 text-gray-600 txt-small">
                <li>
                  <LocalizedClientLink href="/contact" className="hover:text-[#d4af37] transition-colors">
                    Contact Us
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/shipping" className="hover:text-[#d4af37] transition-colors">
                    Shipping Info
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/returns" className="hover:text-[#d4af37] transition-colors">
                    Returns & Exchanges
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/size-guide" className="hover:text-[#d4af37] transition-colors">
                    Size Guide
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Decorative Moroccan Divider */}
        <div className="flex items-center justify-center gap-4 py-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#d4af37]/50" />
          <svg width="32" height="16" viewBox="0 0 32 16" className="text-[#d4af37]">
            <path d="M0 8 L8 0 L16 8 L24 0 L32 8" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M0 8 L8 16 L16 8 L24 16 L32 8" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#d4af37]/50" />
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row w-full mb-8 justify-between items-center gap-4 text-gray-500">
          <Text className="txt-compact-small">
            © {new Date().getFullYear()} Tmurt Store. All rights reserved.
          </Text>
          <div className="flex items-center gap-4 text-xs">
            <LocalizedClientLink href="/privacy" className="hover:text-[#d4af37] transition-colors">
              Privacy Policy
            </LocalizedClientLink>
            <span className="text-[#d4af37]">•</span>
            <LocalizedClientLink href="/terms" className="hover:text-[#d4af37] transition-colors">
              Terms of Service
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </footer>
  )
}

"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"

// Feature-focused menu items (More useful than redundant navigation)
const MainMenuItems = [
  { name: "Collections", href: "/store", icon: "", description: "Browse all products" },
  { name: "Size Calculator", href: "/size-calculator", icon: "", description: "Find your perfect fit" },
  { name: "Digital Passport", href: "/account/passports", icon: "", description: "Authenticity certificates" },
  { name: "My Wallet", href: "/account/wallet", icon: "", description: "Balance & rewards" },
]

const SecondaryMenuItems = [
  { name: "About Tmurt", href: "/about", icon: "" },
  { name: "Contact", href: "/contact", icon: "" },
  { name: "Track Order", href: "/account/orders", icon: "" },
]

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

const SideMenu = ({ regions, locales, currentLocale }: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="relative h-full flex items-center transition-all ease-out duration-200 focus:outline-none hover:text-[#d4af37] group"
                >
                  <span className="sr-only">Menu</span>
                  <div className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[#d4af37] transition-colors">
                      <line x1="3" y1="12" x2="21" y2="12"></line>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                    <span className="text-sm font-medium tracking-widest uppercase">Menu</span>
                  </div>
                </Popover.Button>
              </div>

              {open && (
                <div
                  className="fixed inset-0 z-[50] bg-black/50 backdrop-blur-sm pointer-events-auto"
                  onClick={close}
                  data-testid="side-menu-backdrop"
                />
              )}

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-300"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in duration-200"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <PopoverPanel className="fixed inset-y-0 left-0 w-full sm:w-[400px] z-[51] overflow-hidden flex flex-col shadow-2xl">
                  {/* Background */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#fdfbf7] via-[#f9f3e8] to-[#f0e4cc]" />

                  {/* Pattern Overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-[0.06]"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4af37' fill-rule='evenodd'%3E%3Cpath d='M20 0L0 20l20 20 20-20z'/%3E%3Cpath d='M20 10l-10 10 10 10 10-10z' fill-opacity='0.5'/%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                  />

                  {/* Golden Border */}
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#d4af37] via-[#b8963e] to-[#d4af37]" />

                  {/* Header */}
                  <div className="relative z-10 p-5 flex justify-between items-center border-b border-[#d4af37]/30">
                    <div className="w-24">
                      <img src="/tmurt-logo.png" alt="Tmurt" className="w-full h-auto object-contain" />
                    </div>
                    <button
                      data-testid="close-menu-button"
                      onClick={close}
                      className="w-9 h-9 rounded-full border border-[#d4af37]/30 flex items-center justify-center hover:bg-[#d4af37]/10 text-[#8b7355] hover:text-[#d4af37] transition-all"
                    >
                      <XMark className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Main Menu Items */}
                  <div className="flex-1 overflow-y-auto relative z-10 py-6 px-5">
                    {/* Main Features */}
                    <div className="mb-6">
                      <p className="text-xs uppercase tracking-widest text-[#8b7355] mb-4 font-medium">Explore</p>
                      <ul className="flex flex-col gap-1">
                        {MainMenuItems.map((item) => (
                          <li key={item.name}>
                            <LocalizedClientLink
                              href={item.href}
                              className="group flex items-center gap-4 p-3 rounded-lg hover:bg-[#d4af37]/10 transition-all duration-200"
                              onClick={close}
                              data-testid={`${item.name.toLowerCase().replace(' ', '-')}-link`}
                            >
                              <span className="text-xl">{item.icon}</span>
                              <div className="flex-1">
                                <span
                                  className="block text-base text-[#4a3f2e] group-hover:text-[#d4af37] transition-colors"
                                  style={{ fontFamily: '"Cinzel Decorative", Georgia, serif' }}
                                >
                                  {item.name}
                                </span>
                                <span className="text-xs text-[#8b7355]">{item.description}</span>
                              </div>
                              <ArrowRightMini className="w-4 h-4 text-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </LocalizedClientLink>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center justify-center gap-2 my-4">
                      <div className="h-px bg-[#d4af37]/30 flex-1" />
                      <div className="w-1.5 h-1.5 rotate-45 bg-[#d4af37]" />
                      <div className="h-px bg-[#d4af37]/30 flex-1" />
                    </div>

                    {/* Secondary Links */}
                    <div className="mb-6">
                      <ul className="flex flex-col gap-1">
                        {SecondaryMenuItems.map((item) => (
                          <li key={item.name}>
                            <LocalizedClientLink
                              href={item.href}
                              className="flex items-center gap-3 p-2 rounded hover:bg-[#d4af37]/5 transition-colors text-sm text-[#6b5c4c]"
                              onClick={close}
                            >
                              <span>{item.icon}</span>
                              <span>{item.name}</span>
                            </LocalizedClientLink>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Region/Language Selectors */}
                    <div className="flex flex-col gap-y-3 mt-auto">
                      {!!locales?.length && (
                        <div
                          className="flex justify-between items-center p-3 rounded-lg border border-[#d4af37]/20 bg-white/40 hover:bg-[#d4af37]/5 transition-all cursor-pointer"
                          onMouseEnter={languageToggleState.open}
                          onMouseLeave={languageToggleState.close}
                        >
                          <LanguageSelect
                            toggleState={languageToggleState}
                            locales={locales}
                            currentLocale={currentLocale}
                          />
                          <ArrowRightMini
                            className={clx(
                              "transition-transform duration-150 text-[#d4af37]",
                              languageToggleState.state ? "-rotate-90" : ""
                            )}
                          />
                        </div>
                      )}

                      {regions && regions.length > 0 && (
                        <div
                          className="flex justify-between items-center p-3 rounded-lg border border-[#d4af37]/20 bg-white/40 hover:bg-[#d4af37]/5 transition-all cursor-pointer"
                          onMouseEnter={countryToggleState.open}
                          onMouseLeave={countryToggleState.close}
                        >
                          <CountrySelect
                            toggleState={countryToggleState}
                            regions={regions}
                          />
                          <ArrowRightMini
                            className={clx(
                              "transition-transform duration-150 text-[#d4af37]",
                              countryToggleState.state ? "-rotate-90" : ""
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="relative z-10 p-4 border-t border-[#d4af37]/30 bg-gradient-to-r from-[#f9f3e8] to-[#f0e4cc]">
                    <Text className="text-center text-[#8b7355] text-xs tracking-wider">
                      AUTHENTIC AMAZIGH HERITAGE
                    </Text>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu

"use client"

import { RadioGroup } from "@headlessui/react"
import { isStripeLike, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { Button, Container, Heading, Text, clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer, {
  StripeCardContainer,
} from "@modules/checkout/components/payment-container"
import WalletBalance from "@modules/checkout/components/wallet-balance"
import Divider from "@modules/common/components/divider"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

// Type dyal cart l-payment
interface PaymentCart {
  payment_collection?: {
    payment_sessions?: PaymentSession[]
  }
  gift_cards?: unknown[]
  total?: number
  shipping_methods?: unknown[]
}

// Type dyal payment session
interface PaymentSession {
  status: string
  provider_id: string
}

// Type dyal payment method
interface PaymentMethod {
  id: string
}

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: PaymentCart
  availablePaymentMethods: PaymentMethod[]
}) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )
  const [useWallet, setUseWallet] = useState(false)
  const [walletBalance, setWalletBalance] = useState(0)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  // Fetch wallet balance on component mount
  useEffect(() => {
    fetch("/store/wallet", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.balance) {
          setWalletBalance(data.balance)
        }
      })
      .catch(() => { })
  }, [])

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    // If selecting wallet, don't initiate stripe session
    if (method === "wallet") {
      setUseWallet(true)
      return
    }
    setUseWallet(false)
    if (isStripeLike(method)) {
      await initiatePaymentSession(cart, {
        provider_id: method,
      })
    }
  }

  const handleWalletSelect = () => {
    setUseWallet(!useWallet)
    if (!useWallet) {
      setSelectedPaymentMethod("wallet")
    } else {
      setSelectedPaymentMethod("")
    }
  }

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paidByWallet = useWallet && walletBalance >= (cart?.total || 0)

  const paymentReady =
    (activeSession && cart?.shipping_methods.length !== 0) ||
    paidByGiftcard ||
    paidByWallet

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      // Handle wallet payment
      if (useWallet && walletBalance >= (cart?.total || 0)) {
        // Wallet covers the full amount - proceed to review
        return router.push(
          pathname + "?" + createQueryString("step", "review"),
          {
            scroll: false,
          }
        )
      }

      const shouldInputCard =
        isStripeLike(selectedPaymentMethod) && !activeSession

      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession && !useWallet) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }

      if (!shouldInputCard) {
        return router.push(
          pathname + "?" + createQueryString("step", "review"),
          {
            scroll: false,
          }
        )
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  const cartTotal = cart?.total || 0

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && !paymentReady,
            }
          )}
        >
          Payment
          {!isOpen && paymentReady && <CheckCircleSolid />}
        </Heading>
        {!isOpen && paymentReady && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-payment-button"
            >
              Edit
            </button>
          </Text>
        )}
      </div>
      <div>
        <div className={isOpen ? "block" : "hidden"}>
          {/* Wallet Payment Option - L-khellas b l-wallet */}
          {walletBalance > 0 && (
            <div className="mb-4">
              <Text className="txt-medium-plus text-ui-fg-base mb-3">
                Pay with Wallet
              </Text>
              <WalletBalance
                isSelected={useWallet}
                onSelect={handleWalletSelect}
                cartTotal={cartTotal}
                className="mb-4"
              />
              {useWallet && walletBalance < cartTotal && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                  <Text className="text-sm text-amber-800">
                    Your wallet balance will cover a portion. Select an additional payment method for the remaining amount.
                  </Text>
                </div>
              )}
            </div>
          )}

          {/* Divider between wallet and other methods */}
          {walletBalance > 0 && !paidByGiftcard && availablePaymentMethods?.length && (
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <Text className="text-sm text-gray-500">
                {useWallet && walletBalance < cartTotal
                  ? "Select additional payment"
                  : "Or pay with"
                }
              </Text>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
          )}

          {/* Only show other payment methods if wallet doesn't cover full amount */}
          {!paidByGiftcard &&
            (!paidByWallet || walletBalance < cartTotal) &&
            availablePaymentMethods?.length && (
              <>
                <RadioGroup
                  value={selectedPaymentMethod}
                  onChange={(value: string) => setPaymentMethod(value)}
                >
                  {availablePaymentMethods.map((paymentMethod) => (
                    <div key={paymentMethod.id}>
                      {isStripeLike(paymentMethod.id) ? (
                        <StripeCardContainer
                          paymentProviderId={paymentMethod.id}
                          selectedPaymentOptionId={selectedPaymentMethod}
                          paymentInfoMap={paymentInfoMap}
                          setCardBrand={setCardBrand}
                          setError={setError}
                          setCardComplete={setCardComplete}
                        />
                      ) : (
                        <PaymentContainer
                          paymentInfoMap={paymentInfoMap}
                          paymentProviderId={paymentMethod.id}
                          selectedPaymentOptionId={selectedPaymentMethod}
                        />
                      )}
                    </div>
                  ))}
                </RadioGroup>
              </>
            )}

          {paidByGiftcard && (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Payment method
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                Gift card
              </Text>
            </div>
          )}

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          <Button
            size="large"
            className={clx(
              "mt-6 w-full",
              useWallet && paidByWallet && "bg-gradient-to-r from-[#d4af37] to-[#b8963e] hover:from-[#b8963e] hover:to-[#8b7355]"
            )}
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={
              (isStripeLike(selectedPaymentMethod) && !cardComplete && !paidByWallet) ||
              (!selectedPaymentMethod && !paidByGiftcard && !paidByWallet)
            }
            data-testid="submit-payment-button"
          >
            {paidByWallet
              ? "Pay with Wallet"
              : !activeSession && isStripeLike(selectedPaymentMethod)
                ? " Enter card details"
                : "Continue to review"}
          </Button>
        </div>

        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && (useWallet || activeSession) ? (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment method
                </Text>
                <Text
                  className="txt-medium text-ui-fg-subtle"
                  data-testid="payment-method-summary"
                >
                  {useWallet
                    ? "Wallet Balance"
                    : paymentInfoMap[activeSession?.provider_id]?.title ||
                    activeSession?.provider_id}
                </Text>
              </div>
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment details
                </Text>
                <div
                  className="flex gap-2 txt-medium text-ui-fg-subtle items-center"
                  data-testid="payment-details-summary"
                >
                  <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                    {useWallet ? (
                      <svg className="w-4 h-4 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    ) : paymentInfoMap[selectedPaymentMethod]?.icon || (
                      <CreditCard />
                    )}
                  </Container>
                  <Text>
                    {useWallet
                      ? `${walletBalance.toFixed(2)} MAD`
                      : isStripeLike(selectedPaymentMethod) && cardBrand
                        ? cardBrand
                        : "Another step will appear"}
                  </Text>
                </div>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Payment method
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                Gift card
              </Text>
            </div>
          ) : null}
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default Payment

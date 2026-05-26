import { useEffect, useState } from 'react'
import Header from './components/header'
import Footer from './components/Footer'
import HomePage from './views/homepage'
import GameDetailPage from './views/game-detail-page'
import PaymentPage from './views/payment-page'
import InfoPage from './views/info-page'
import TransactionHistoryPage from './views/transaction-history-page'
import { getGameBySlug } from './data/games'
import type { PaymentDraft, PendingPayment } from './types/payment'
import { staticPages, type StaticPageSlug } from './data/site-content'

const HOME_HASH = '#/'
const PAYMENT_STORAGE_KEY = 'pending-payments'
const API_BASE_URL = 'https://javestopup.site'

type CreatePaymentResponse = {
  success?: boolean
  result?: boolean
  message?: string
  tripay?: {
    success?: boolean
    message?: string
  } | null
  data?: {
    merchant_ref?: string
    reference?: string
    checkout_url?: string
    qr_url?: string
    qr_string?: string
    status?: string
    amount?: number
    total_amount?: number
    expired_time?: string | number
    created_at?: string
  } | null
}

const toAbsoluteUrl = (value?: string) => {
  if (!value) {
    return undefined
  }

  try {
    return new URL(value, API_BASE_URL).toString()
  } catch {
    return value
  }
}

const parseDateValue = (value?: string | number) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return new Date(value > 10_000_000_000 ? value : value * 1000).toISOString()
  }

  if (typeof value === 'string' && value.trim()) {
    const timestamp = Date.parse(value)

    if (!Number.isNaN(timestamp)) {
      return new Date(timestamp).toISOString()
    }
  }

  return null
}

const formatPaymentStatus = (status?: string) => {
  const normalizedStatus = status?.toLowerCase()

  if (normalizedStatus === 'paid') {
    return 'paid' as const
  }

  if (normalizedStatus === 'failed') {
    return 'failed' as const
  }

  if (normalizedStatus === 'expired') {
    return 'expired' as const
  }

  return 'pending' as const
}

const getCreatePaymentErrorMessage = (payload: CreatePaymentResponse) => {
  if (payload.tripay?.message) {
    return payload.tripay.message
  }

  if (payload.message) {
    return payload.message
  }

  return 'Gagal membuat invoice pembayaran.'
}

const getRouteState = () => {
  const hash = window.location.hash || HOME_HASH
  const gameMatch = hash.match(/^#\/game\/([^/]+)$/)
  const paymentMatch = hash.match(/^#\/payment\/([^/]+)$/)
  const invoiceMatch = hash.match(/^#\/invoice\/([^/]+)$/)
  const historyMatch = hash === '#/riwayat'
  const staticMatch = hash.match(/^#\/(privacy-policy|terms|about|contact)$/)

  return {
    gameSlug: gameMatch?.[1] ?? null,
    paymentSlug: paymentMatch?.[1] ?? null,
    invoiceId: invoiceMatch?.[1] ?? null,
    isHistoryPage: historyMatch,
    staticPage: (staticMatch?.[1] as StaticPageSlug | undefined) ?? null,
  }
}

function App() {
  const [routeState, setRouteState] = useState(() => getRouteState())
  const [pendingPayments, setPendingPayments] = useState<Record<string, PendingPayment>>(() => {
    const savedPayment = window.sessionStorage.getItem(PAYMENT_STORAGE_KEY)

    if (!savedPayment) {
      return {}
    }

    try {
      return JSON.parse(savedPayment) as Record<string, PendingPayment>
    } catch {
      return {}
    }
  })

  useEffect(() => {
    const syncRoute = () => {
      setRouteState(getRouteState())
    }

    window.addEventListener('hashchange', syncRoute)

    if (!window.location.hash) {
      window.location.hash = HOME_HASH
    }

    return () => window.removeEventListener('hashchange', syncRoute)
  }, [])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    })
  }, [
    routeState.gameSlug,
    routeState.paymentSlug,
    routeState.invoiceId,
    routeState.isHistoryPage,
    routeState.staticPage,
  ])

  const handleSelectGame = (slug: string) => {
    window.location.hash = `/game/${slug}`
  }

  const handleBackHome = () => {
    window.location.hash = HOME_HASH
  }

  const updatePendingPayment = (merchantRef: string, updates: Partial<PendingPayment>) => {
    setPendingPayments((current) => {
      const existingPayment = current[merchantRef]

      if (!existingPayment) {
        return current
      }

      const nextPayments = {
        ...current,
        [merchantRef]: {
          ...existingPayment,
          ...updates,
        },
      }

      window.sessionStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(nextPayments))
      return nextPayments
    })
  }

  const handleStartPayment = async (paymentDraft: PaymentDraft) => {
    const response = await fetch(`${API_BASE_URL}/api/payment/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        serviceCode: paymentDraft.serviceCode,
        data_no: paymentDraft.playerId,
        data_zone: paymentDraft.zoneId,
        sellingPrice: paymentDraft.sellingPrice,
        resellerPrice: paymentDraft.resellerPrice,
        customerPhone: paymentDraft.whatsAppNumber,
      }),
    })

    const rawResponse = await response.text()
    let payload: CreatePaymentResponse = {}

    try {
      payload = JSON.parse(rawResponse) as CreatePaymentResponse
    } catch {
      throw new Error('Respons backend pembayaran tidak valid.')
    }

    if (
      !response.ok ||
      payload.result === false ||
      payload.success === false ||
      payload.tripay?.success === false ||
      !payload.data?.merchant_ref ||
      !payload.data.reference
    ) {
      throw new Error(getCreatePaymentErrorMessage(payload))
    }

    const createdAt = parseDateValue(payload.data.created_at) ?? paymentDraft.createdAt
    const expiresAt = parseDateValue(payload.data.expired_time) ?? paymentDraft.expiresAt
    const totalPrice =
      typeof payload.data.total_amount === 'number'
        ? payload.data.total_amount
        : typeof payload.data.amount === 'number'
          ? payload.data.amount
          : paymentDraft.totalPrice

    const nextPayment: PendingPayment = {
      ...paymentDraft,
      invoiceId: payload.data.merchant_ref,
      merchantRef: payload.data.merchant_ref,
      reference: payload.data.reference,
      checkoutUrl: toAbsoluteUrl(payload.data.checkout_url),
      qrUrl: toAbsoluteUrl(payload.data.qr_url),
      qrString: payload.data.qr_string,
      paymentStatus: formatPaymentStatus(payload.data.status),
      paymentGatewayStatus: payload.data.status,
      resellerOrderStatus: 'pending',
      createdAt,
      expiresAt,
      totalPrice,
      paymentFee: Math.max(totalPrice - paymentDraft.packagePrice, 0),
    }

    setPendingPayments((current) => {
      const nextPayments = {
        ...current,
        [nextPayment.merchantRef]: nextPayment,
      }

      window.sessionStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(nextPayments))
      return nextPayments
    })

    window.location.hash = `/invoice/${nextPayment.merchantRef}`
  }

  const selectedGame = routeState.gameSlug ? getGameBySlug(routeState.gameSlug) : null
  const activeStaticPage =
    routeState.staticPage && routeState.staticPage in staticPages ? routeState.staticPage : null
  const activePayment = routeState.invoiceId
    ? pendingPayments[routeState.invoiceId] ?? null
    : routeState.paymentSlug
      ? Object.values(pendingPayments).find((payment) => payment.gameSlug === routeState.paymentSlug) ?? null
      : null

  return (
    <div className="w-full min-h-screen bg-[#1c1e25]">
      <Header />
      <main style={{ paddingTop: '64px', paddingBottom: '40px' }}>
        {activePayment ? (
          <PaymentPage payment={activePayment} onPaymentChange={updatePendingPayment} />
        ) : selectedGame ? (
          <GameDetailPage game={selectedGame} onBack={handleBackHome} onStartPayment={handleStartPayment} />
        ) : routeState.isHistoryPage ? (
          <TransactionHistoryPage />
        ) : activeStaticPage ? (
          <InfoPage slug={activeStaticPage} />
        ) : (
          <HomePage onSelectGame={handleSelectGame} />
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App

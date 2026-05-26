import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  AlertCircle,
  CalendarDays,
  Copy,
  LockKeyhole,
  LogOut,
  PackageSearch,
  RefreshCw,
  Search,
} from 'lucide-react'
import { games } from '../data/games'
import '../assets/transaction-history.css'

type OrderStatus = 'PENDING' | 'PAID' | 'SUCCESS' | 'FAILED' | string

type GameFilterOption = {
  game_slug?: string
  game_title?: string
  slug?: string
  title?: string
  name?: string
  label?: string
}

type TransactionOrder = {
  order_id: string
  service: string
  player_id: string
  zone_id?: string | null
  price: number
  status: OrderStatus
  merchant_ref: string
  created_at: string
}

type OrdersResponse = {
  success?: boolean
  data?: TransactionOrder[]
  filters?: {
    games?: GameFilterOption[]
  }
  message?: string
}

const PAGE_SIZE_OPTIONS = [10, 25, 50]
const ADMIN_TOKEN_STORAGE_KEY = 'admin-orders-token'
const ALL_GAMES_VALUE = 'ALL_GAMES'
const ORDERS_API_URL = 'https://javestopup.site/api/orders'

const formatRupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)

const formatDateParts = (value: string) => {
  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return {
      full: value,
      date: value,
      time: '-',
      inputValue: '',
    }
  }

  return {
    full: new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(parsedDate),
    date: new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(parsedDate),
    time: new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(parsedDate),
    inputValue: parsedDate.toISOString().slice(0, 10),
  }
}

const getStatusVariant = (status: string) => {
  const normalizedStatus = status.toUpperCase()

  if (normalizedStatus === 'PAID' || normalizedStatus === 'SUCCESS') {
    return 'is-success'
  }

  if (normalizedStatus === 'FAILED') {
    return 'is-failed'
  }

  return 'is-pending'
}

const getStatusLabel = (status: string) => {
  const normalizedStatus = status.toUpperCase()

  if (normalizedStatus === 'PAID' || normalizedStatus === 'SUCCESS') {
    return 'Berhasil'
  }

  if (normalizedStatus === 'FAILED') {
    return 'Gagal'
  }

  return 'Pending'
}

const sortOrdersByNewest = (items: TransactionOrder[]) =>
  [...items].sort((left, right) => {
    const leftTime = new Date(left.created_at).getTime()
    const rightTime = new Date(right.created_at).getTime()

    if (Number.isNaN(leftTime) || Number.isNaN(rightTime)) {
      return right.order_id.localeCompare(left.order_id)
    }

    return rightTime - leftTime
  })

const normalizeText = (value?: string | null) => value?.trim().toLowerCase() ?? ''

const FALLBACK_GAME_OPTIONS = games.map((game) => ({
  game_slug: game.slug,
  game_title: game.title,
}))

const normalizeGameOption = (game: GameFilterOption | string) => {
  if (typeof game === 'string') {
    const matchedGame = games.find((item) => item.slug === game || item.title.toLowerCase() === game.toLowerCase())

    return matchedGame
      ? { game_slug: matchedGame.slug, game_title: matchedGame.title }
      : null
  }

  const gameSlug = game.game_slug ?? game.slug
  const gameTitle = game.game_title ?? game.title ?? game.name ?? game.label

  if (!gameSlug || !gameTitle) {
    return null
  }

  return {
    game_slug: gameSlug,
    game_title: gameTitle,
  }
}

const getSafeGameOptions = (rawGames?: Array<GameFilterOption | string>) => {
  const normalizedGames = Array.isArray(rawGames)
    ? rawGames.map(normalizeGameOption).filter((game): game is NonNullable<ReturnType<typeof normalizeGameOption>> => Boolean(game))
    : []

  if (normalizedGames.length > 0) {
    return normalizedGames
  }

  return FALLBACK_GAME_OPTIONS
}

const TransactionHistoryPage = () => {
  const [adminToken, setAdminToken] = useState(() => window.sessionStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) ?? '')
  const [tokenInput, setTokenInput] = useState(() => window.sessionStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) ?? '')
  const [isSubmittingToken, setIsSubmittingToken] = useState(false)
  const [orders, setOrders] = useState<TransactionOrder[]>([])
  const [initialLoading, setInitialLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [hasLoadedOrders, setHasLoadedOrders] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedGame, setSelectedGame] = useState(ALL_GAMES_VALUE)
  const [gameOptions, setGameOptions] = useState<GameFilterOption[]>([])
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0])

  const buildOrdersUrl = useCallback((gameFilter = selectedGame) => {
    const params = new URLSearchParams()

    if (statusFilter !== 'ALL') {
      params.set('status', statusFilter.toLowerCase())
    }

    const normalizedSearch = debouncedSearch.trim()

    if (normalizedSearch) {
      params.set('search', normalizedSearch)
    }

    if (gameFilter !== ALL_GAMES_VALUE) {
      params.set('filter_game', gameFilter)
    }

    params.set('limit', String(pageSize))

    const queryString = params.toString()

    return queryString ? `${ORDERS_API_URL}?${queryString}` : ORDERS_API_URL
  }, [debouncedSearch, pageSize, selectedGame, statusFilter])

  const applyOrdersPayload = useCallback((payload: OrdersResponse) => {
    setOrders(Array.isArray(payload.data) ? sortOrdersByNewest(payload.data) : [])
    setGameOptions(getSafeGameOptions(payload.filters?.games))
  }, [])

  const fetchOrders = useCallback(async (
    token: string,
    gameFilter = selectedGame,
    options?: { showInitialLoader?: boolean },
  ) => {
    const shouldShowInitialLoader = options?.showInitialLoader ?? !hasLoadedOrders

    if (shouldShowInitialLoader) {
      setInitialLoading(true)
    } else {
      setIsFetching(true)
    }

    setErrorMessage(null)

    try {
      const response = await fetch(buildOrdersUrl(gameFilter), {
        headers: {
          'x-admin-token': token,
        },
      })
      const payload = (await response.json()) as OrdersResponse

      if (response.status === 401 || payload.message === 'Unauthorized') {
        throw new Error('Token admin salah atau tidak valid.')
      }

      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || 'Riwayat transaksi gagal dimuat.')
      }

      applyOrdersPayload(payload)
      setHasLoadedOrders(true)
    } catch (error) {
      const nextMessage =
        error instanceof Error ? error.message : 'Terjadi kendala saat mengambil riwayat transaksi.'

      if (nextMessage === 'Token admin salah atau tidak valid.') {
        window.sessionStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY)
        setAdminToken('')
        setTokenInput('')
        setOrders([])
        setGameOptions([])
        setHasLoadedOrders(false)
      } else if (shouldShowInitialLoader) {
        setOrders([])
        setGameOptions([])
      }

      setErrorMessage(nextMessage)
    } finally {
      setInitialLoading(false)
      setIsFetching(false)
    }
  }, [applyOrdersPayload, buildOrdersUrl, hasLoadedOrders, selectedGame])

  useEffect(() => {
    if (!adminToken) {
      setOrders([])
      setErrorMessage(null)
      setInitialLoading(false)
      setIsFetching(false)
      setHasLoadedOrders(false)
      return
    }

    void fetchOrders(adminToken)
  }, [adminToken, debouncedSearch, fetchOrders, pageSize, selectedDate, selectedGame, statusFilter])

  useEffect(() => {
    const debounceTimer = window.setTimeout(() => {
      setDebouncedSearch(searchInput)
    }, 500)

    return () => window.clearTimeout(debounceTimer)
  }, [searchInput])

  const handleSubmitToken = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedToken = tokenInput.trim()

    if (!trimmedToken) {
      setErrorMessage('Masukkan token admin terlebih dahulu.')
      return
    }

    setIsSubmittingToken(true)
    setErrorMessage(null)

    try {
      window.sessionStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, trimmedToken)
      setAdminToken(trimmedToken)
    } catch (error) {
      setOrders([])
      setGameOptions([])
      setAdminToken('')
      setHasLoadedOrders(false)
      setErrorMessage(
        error instanceof Error ? error.message : 'Token admin salah atau tidak valid.',
      )
    } finally {
      setIsSubmittingToken(false)
    }
  }

  const handleLogoutAdmin = () => {
    window.sessionStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY)
    setAdminToken('')
    setTokenInput('')
    setOrders([])
    setErrorMessage(null)
    setInitialLoading(false)
    setIsFetching(false)
    setHasLoadedOrders(false)
    setSearchInput('')
    setDebouncedSearch('')
    setStatusFilter('ALL')
    setSelectedDate('')
    setSelectedGame(ALL_GAMES_VALUE)
    setGameOptions([])
    setPageSize(PAGE_SIZE_OPTIONS[0])
  }

  const availableStatuses = useMemo(
    () => ['ALL', ...new Set(orders.map((order) => order.status.toUpperCase()))],
    [orders],
  )

  const filteredOrders = useMemo(() => {
    const normalizedSearch = normalizeText(debouncedSearch)

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === 'ALL' || order.status.toUpperCase() === statusFilter.toUpperCase()
      const matchesDate =
        !selectedDate || formatDateParts(order.created_at).inputValue === selectedDate
      const matchesSearch =
        !normalizedSearch ||
        [
          order.order_id,
          order.service,
          order.player_id,
          order.zone_id,
          order.merchant_ref,
          order.status,
        ]
          .map((value) => normalizeText(value))
          .some((value) => value.includes(normalizedSearch))

      return matchesStatus && matchesDate && matchesSearch
    })
  }, [debouncedSearch, orders, selectedDate, statusFilter])

  const visibleOrders = useMemo(() => filteredOrders.slice(0, pageSize), [filteredOrders, pageSize])

  const paidCount = useMemo(
    () =>
      filteredOrders.filter((order) => {
        const status = order.status.toUpperCase()
        return status === 'PAID' || status === 'SUCCESS'
      }).length,
    [filteredOrders],
  )

  if (!adminToken) {
    return (
      <section className="history-section">
        <div className="history-shell">
          <div className="history-login-shell">
            <div className="history-login-card">
              <div className="history-login-icon">
                <LockKeyhole size={28} />
              </div>
              <span className="history-kicker">Admin Access</span>
              <h1>Masuk ke halaman riwayat transaksi.</h1>
              <p>
                Halaman ini dilindungi token admin. Masukkan token yang valid untuk melihat data order.
              </p>

              <form className="history-login-form" onSubmit={handleSubmitToken}>
                <label className="history-login-field">
                  <span>Token Admin</span>
                  <input
                    type="password"
                    placeholder="Masukkan token admin"
                    value={tokenInput}
                    onChange={(event) => setTokenInput(event.target.value)}
                    autoComplete="current-password"
                  />
                </label>

                {errorMessage ? <p className="history-login-error">{errorMessage}</p> : null}

                <button type="submit" className="history-refresh-button" disabled={isSubmittingToken}>
                  <LockKeyhole size={18} />
                  <span>{isSubmittingToken ? 'Memverifikasi...' : 'Masuk Admin'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="history-section">
      <div className="history-shell">
        <div className="history-hero">
          <div>
            <span className="history-kicker">Riwayat Transaksi</span>
            <h1>Detail Riwayat Transaksi.</h1>
            <p>
              Pantau semua aktivitas top up kamu secara real-time. Lihat status pesanan, detail transaksi, dan riwayat pembayaran dengan mudah dalam satu halaman.Pantau semua aktivitas top up kamu secara real-time. Lihat status pesanan, detail transaksi, dan riwayat pembayaran dengan mudah dalam satu halaman.
            </p>
          </div>

          <div className="history-hero-actions">
            <button type="button" className="history-refresh-button" onClick={() => void fetchOrders(adminToken)}>
              <RefreshCw size={18} />
              <span>Muat Ulang</span>
            </button>
            <button type="button" className="history-logout-button" onClick={handleLogoutAdmin}>
              <LogOut size={18} />
              <span>Keluar Admin</span>
            </button>
          </div>
        </div>

        <div className="history-panel">
          {initialLoading && !hasLoadedOrders ? (
            <div className="history-state-card">
              <div className="history-state-icon is-loading">
                <RefreshCw size={28} />
              </div>
              <h2>Memuat riwayat transaksi</h2>
              <p>Data order sedang diambil dari server.</p>
            </div>
          ) : errorMessage && orders.length === 0 ? (
            <div className="history-state-card">
              <div className="history-state-icon is-error">
                <AlertCircle size={28} />
              </div>
              <h2>Riwayat belum bisa ditampilkan</h2>
              <p>{errorMessage}</p>
              <button type="button" className="history-state-button" onClick={() => void fetchOrders(adminToken)}>
                Coba lagi
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="history-state-card">
              <div className="history-state-icon is-empty">
                <PackageSearch size={28} />
              </div>
              <h2>Belum ada transaksi</h2>
              <p>Order yang sudah dibuat nanti akan muncul di halaman ini.</p>
            </div>
          ) : (
            <>
              {errorMessage ? <p className="history-inline-error">{errorMessage}</p> : null}

              <div className="history-toolbar">
                <div className="history-toolbar-group is-inline">
                  <div className="history-inline-topline">
                    <span className="history-toolbar-label">Menampilkan</span>
                    <select
                      className="history-select is-compact"
                      value={pageSize}
                      onChange={(event) => setPageSize(Number(event.target.value))}
                    >
                      {PAGE_SIZE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <span className="history-toolbar-label">dari {filteredOrders.length} data</span>
                  </div>

                  <div className="history-inline-bottomline">
                    <span className="history-toolbar-label">Game</span>
                    <label className="history-inline-filter">
                      <select
                        className="history-select history-select-inline"
                        value={selectedGame}
                        onChange={(event) => setSelectedGame(event.target.value)}
                      >
                        <option value={ALL_GAMES_VALUE}>Semua Game</option>
                        {gameOptions.map((game) => (
                          <option key={game.game_slug} value={game.game_slug}>
                            {game.game_title}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>

                <div className="history-toolbar-group">
                  <label className="history-input-wrap">
                    <CalendarDays size={18} />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(event) => setSelectedDate(event.target.value)}
                    />
                  </label>

                  <label className="history-input-wrap">
                    <Search size={18} />
                    <input
                      type="search"
                      placeholder="Cari order, player ID, service..."
                      value={searchInput}
                      onChange={(event) => setSearchInput(event.target.value)}
                    />
                  </label>
                </div>
              </div>

              <div className="history-filter-row">
                <div className="history-filter-card">
                  <span className="history-filter-label">Status</span>
                  <select
                    className="history-select"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                  >
                    {availableStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status === 'ALL' ? 'Semua Status' : getStatusLabel(status)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="history-metric-card">
                  <span>Total Order Tampil</span>
                  <strong>{filteredOrders.length}</strong>
                </div>

                <div className="history-metric-card is-success">
                  <span>Transaksi Berhasil</span>
                  <strong>{paidCount}</strong>
                </div>
              </div>

              <div className="history-table-meta">
                <span>{isFetching ? 'Memuat data terbaru...' : ''}</span>
              </div>

              <div className="history-table-wrapper">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Tanggal & Waktu</th>
                      <th>ID Transaksi</th>
                      <th>Player Data</th>
                      <th>Produk / Service</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleOrders.map((order) => {
                      const dateParts = formatDateParts(order.created_at)

                      return (
                        <tr key={order.order_id}>
                          <td>
                            <div className="history-cell-stack">
                              <strong>{dateParts.date}</strong>
                              <span>{dateParts.time}</span>
                            </div>
                          </td>
                          <td>
                            <div className="history-cell-stack">
                              <strong className="history-primary-id">{order.order_id}</strong>
                              <span>{order.merchant_ref}</span>
                            </div>
                          </td>
                          <td>
                            <div className="history-cell-stack">
                              <strong>{order.player_id}</strong>
                              <span>Zone ID: {order.zone_id || '-'}</span>
                            </div>
                          </td>
                          <td>
                            <div className="history-cell-stack">
                              <strong>{order.service}</strong>
                              <span>Ref merchant tersimpan</span>
                            </div>
                          </td>
                          <td>
                            <div className="history-cell-stack">
                              <strong>{formatRupiah(order.price)}</strong>
                              <span>Top up game</span>
                            </div>
                          </td>
                          <td>
                            <span className={`history-status-badge ${getStatusVariant(order.status)}`}>
                              {getStatusLabel(order.status)}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="history-card-list">
                {visibleOrders.map((order) => {
                  const dateParts = formatDateParts(order.created_at)

                  return (
                    <article key={`${order.order_id}-mobile`} className="history-card">
                      <div className="history-card-head">
                        <div>
                          <span className="history-card-label">ID Transaksi</span>
                          <strong className="history-primary-id">{order.order_id}</strong>
                          <small>{order.merchant_ref}</small>
                        </div>
                        <span className={`history-status-badge ${getStatusVariant(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>

                      <div className="history-card-grid">
                        <div>
                          <span>Tanggal & Waktu</span>
                          <strong>{dateParts.full}</strong>
                        </div>
                        <div>
                          <span>Total</span>
                          <strong>{formatRupiah(order.price)}</strong>
                        </div>
                        <div>
                          <span>Produk / Service</span>
                          <strong>{order.service}</strong>
                        </div>
                        <div>
                          <span>Player ID</span>
                          <strong>{order.player_id}</strong>
                        </div>
                        <div>
                          <span>Zone ID</span>
                          <strong>{order.zone_id || '-'}</strong>
                        </div>
                        <div>
                          <span>Merchant Ref</span>
                          <strong>{order.merchant_ref}</strong>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="history-copy-button"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(order.order_id)
                          } catch {
                            // no-op for unsupported clipboard environments
                          }
                        }}
                      >
                        <Copy size={16} />
                        <span>Salin Order ID</span>
                      </button>
                    </article>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default TransactionHistoryPage

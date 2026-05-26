import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Copy, Download, QrCode, ShieldCheck, X } from 'lucide-react';
import '../assets/payment-page.css';
import type { PendingPayment } from '../types/payment';

interface PaymentPageProps {
  payment: PendingPayment;
  onPaymentChange?: (merchantRef: string, updates: Partial<PendingPayment>) => void;
}

const formatPrice = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;

const API_BASE_URL =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'javestopup.site' || window.location.hostname === 'www.javestopup.site')
    ? window.location.origin
    : 'https://javestopup.site';

type PaymentStatusResponse = {
  success?: boolean;
  result?: boolean;
  message?: string;
  data?: {
    status?: string;
    paymentStatus?: string;
    resellerTrxid?: string;
  } | null;
};

const padTime = (value: number) => String(value).padStart(2, '0');

const normalizePaymentStatus = (paymentStatus?: string, gatewayStatus?: string): PendingPayment['paymentStatus'] => {
  const normalizedPaymentStatus = paymentStatus?.toLowerCase();
  const normalizedGatewayStatus = gatewayStatus?.toLowerCase();

  if (normalizedPaymentStatus === 'paid' || normalizedGatewayStatus === 'paid') {
    return 'paid';
  }

  if (normalizedPaymentStatus === 'failed' || normalizedGatewayStatus === 'failed') {
    return 'failed';
  }

  if (normalizedPaymentStatus === 'expired' || normalizedGatewayStatus === 'expired') {
    return 'expired';
  }

  return 'pending';
};

const formatPaymentStatusLabel = (status?: PendingPayment['paymentStatus']) => {
  if (status === 'paid') {
    return 'Success / Sudah Dibayar';
  }

  if (status === 'failed') {
    return 'Gagal';
  }

  if (status === 'expired') {
    return 'Expired';
  }

  return 'Belum Bayar';
};

const getSuccessDialogStorageKey = (merchantRef: string) => `payment-success-dialog:${merchantRef}`;

const PaymentPage = ({ payment, onPaymentChange }: PaymentPageProps) => {
  const [livePayment, setLivePayment] = useState(payment);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = new Date(payment.expiresAt).getTime() - Date.now();
    return Math.max(diff, 0);
  });

  useEffect(() => {
    setLivePayment(payment);
  }, [payment]);

  useEffect(() => {
    if (livePayment.paymentStatus !== 'paid') {
      setIsSuccessDialogOpen(false);
      return;
    }

    const storageKey = getSuccessDialogStorageKey(livePayment.merchantRef);

    if (window.sessionStorage.getItem(storageKey) === 'shown') {
      return;
    }

    setIsSuccessDialogOpen(true);
    window.sessionStorage.setItem(storageKey, 'shown');
  }, [livePayment.merchantRef, livePayment.paymentStatus]);

  useEffect(() => {
    if (!isSuccessDialogOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isSuccessDialogOpen]);

  useEffect(() => {
    if (livePayment.paymentStatus === 'paid') {
      setTimeLeft(0);
      return;
    }

    const timer = window.setInterval(() => {
      const diff = new Date(livePayment.expiresAt).getTime() - Date.now();
      setTimeLeft(Math.max(diff, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [livePayment.expiresAt, livePayment.paymentStatus]);

  useEffect(() => {
    let isActive = true;
    let pollTimer: number | null = null;

    const shouldStopPolling =
      livePayment.paymentStatus === 'paid' || livePayment.paymentStatus === 'failed' || livePayment.paymentStatus === 'expired';

    if (shouldStopPolling) {
      return () => {
        if (pollTimer !== null) {
          window.clearTimeout(pollTimer);
        }
      };
    }

    const pollPaymentStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/payment/status/${encodeURIComponent(livePayment.merchantRef)}`);

        if (!response.ok) {
          throw new Error(`Status invoice gagal dimuat: ${response.status}`);
        }

        const payload = (await response.json()) as PaymentStatusResponse;
        const nextPaymentStatus = normalizePaymentStatus(payload.data?.paymentStatus, payload.data?.status);
        const nextGatewayStatus = payload.data?.status;
        const nextResellerTrxid = payload.data?.resellerTrxid;

        if (!isActive) {
          return;
        }

        if (
          nextPaymentStatus !== livePayment.paymentStatus ||
          nextGatewayStatus !== livePayment.paymentGatewayStatus ||
          nextResellerTrxid !== livePayment.resellerTrxid
        ) {
          const updates: Partial<PendingPayment> = {
            paymentStatus: nextPaymentStatus,
            paymentGatewayStatus: nextGatewayStatus,
            resellerTrxid: nextResellerTrxid,
          };

          setLivePayment((current) => ({
            ...current,
            ...updates,
          }));
          onPaymentChange?.(livePayment.merchantRef, updates);
        }

        if (nextPaymentStatus === 'paid') {
          setTimeLeft(0);
          return;
        }
      } catch {
        if (!isActive) {
          return;
        }
      }

      if (isActive) {
        pollTimer = window.setTimeout(pollPaymentStatus, 5000);
      }
    };

    void pollPaymentStatus();

    return () => {
      isActive = false;

      if (pollTimer !== null) {
        window.clearTimeout(pollTimer);
      }
    };
  }, [
    livePayment.merchantRef,
    livePayment.paymentGatewayStatus,
    livePayment.paymentStatus,
    livePayment.resellerTrxid,
    onPaymentChange,
  ]);

  const countdown = useMemo(() => {
    const totalSeconds = Math.floor(timeLeft / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      hours: padTime(hours),
      minutes: padTime(minutes),
      seconds: padTime(seconds),
    };
  }, [timeLeft]);

  const orderDate = useMemo(
    () =>
      new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(new Date(livePayment.createdAt)),
    [livePayment.createdAt],
  );

  const uniqueCode = livePayment.totalPrice - livePayment.packagePrice - livePayment.paymentFee;
  const statusLabel = formatPaymentStatusLabel(livePayment.paymentStatus);
  const qrImageUrl = useMemo(() => {
    if (livePayment.qrUrl) {
      return livePayment.qrUrl;
    }

    if (livePayment.qrString) {
      return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(livePayment.qrString)}`;
    }

    return null;
  }, [livePayment.qrString, livePayment.qrUrl]);
  const paymentActionUrl = livePayment.checkoutUrl ?? qrImageUrl;
  const returnToGameLabel = `Kembali ke ${livePayment.gameTitle}`;

  return (
    <section className="payment-section">
      {isSuccessDialogOpen ? (
        <div className="payment-success-dialog-backdrop" role="presentation">
          <div
            className="payment-success-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-success-title"
          >
            <button
              type="button"
              className="payment-success-dialog-close"
              aria-label="Tutup dialog sukses pembayaran"
              onClick={() => setIsSuccessDialogOpen(false)}
            >
              <X size={22} />
            </button>

            <div className="payment-success-dialog-icon">
              <CheckCircle2 size={34} />
            </div>

            <div className="payment-success-dialog-copy">
              <span className="payment-success-dialog-badge">Payment Success</span>
              <h2 id="payment-success-title">Success / Sudah Dibayar</h2>
              <p>Terimakasih, pembayaran kamu sudah berhasil kami terima dan pesanan sedang diproses.</p>
            </div>

            <div className="payment-success-dialog-summary">
              <div>
                <span>Invoice</span>
                <strong>{livePayment.merchantRef}</strong>
              </div>
              <div>
                <span>Item</span>
                <strong>{livePayment.packageName}</strong>
              </div>
              <div>
                <span>Total</span>
                <strong>{formatPrice(livePayment.totalPrice)}</strong>
              </div>
            </div>

            <button
              type="button"
              className="payment-success-dialog-button"
              onClick={() => {
                window.location.hash = `/game/${livePayment.gameSlug}`;
              }}
            >
              {returnToGameLabel}
            </button>
          </div>
        </div>
      ) : null}

      <div className="payment-container">
        <div className="payment-layout">
          <aside className="payment-sidebar-card">
            <div className="payment-status-copy">
              <h1>{statusLabel}</h1>
              <p>{livePayment.paymentStatus === 'paid' ? 'Pembayaran sudah kami terima.' : 'Selesaikan pembayaran sebelum waktu habis.'}</p>
            </div>

            {livePayment.paymentStatus !== 'paid' ? (
              <>
                <div className="payment-countdown">
                  <div className="payment-countdown-box">
                    <strong>{countdown.hours}</strong>
                    <span>Jam</span>
                  </div>
                  <div className="payment-countdown-box">
                    <strong>{countdown.minutes}</strong>
                    <span>Menit</span>
                  </div>
                  <div className="payment-countdown-box">
                    <strong>{countdown.seconds}</strong>
                    <span>Detik</span>
                  </div>
                </div>

                <p className="payment-sidebar-note">Agar pesanan kamu tidak expired.</p>
              </>
            ) : (
              <p className="payment-sidebar-note">Invoice ini sudah lunas dan polling status dihentikan otomatis.</p>
            )}

            <div className="payment-qr-card">
              <div className="payment-qr-frame" aria-label="QR pembayaran Tripay">
                {qrImageUrl ? (
                  <img
                    src={qrImageUrl}
                    alt={`QR pembayaran ${livePayment.paymentLabel}`}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <div className="payment-qr-center">
                    <QrCode size={38} />
                    <span>{payment.checkoutUrl ? 'Buka Checkout' : 'QRIS'}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              className="payment-download-button"
              onClick={() => {
                if (!paymentActionUrl) {
                  return;
                }

                window.open(paymentActionUrl, '_blank', 'noopener,noreferrer');
              }}
            >
              <Download size={18} />
              <span>{qrImageUrl ? 'Unduh kode QR' : 'Buka checkout pembayaran'}</span>
            </button>
          </aside>

          <div className="payment-main">
            <section className="payment-meta-card">
              <div>
                <span>Tanggal Pembelian</span>
                <strong>{orderDate}</strong>
              </div>
              <div>
                <span>Nomor Invoice</span>
                <strong>{livePayment.merchantRef}</strong>
              </div>
              <div>
                <span>Metode Pembayaran</span>
                <strong>{livePayment.paymentLabel}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{statusLabel}</strong>
              </div>
            </section>

            <section className="payment-detail-card">
              <div className="payment-game-header">
                <div className="payment-game-badge">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h2>{livePayment.gameTitle}</h2>
                  <p>Pesanan top up siap dibayar.</p>
                </div>
              </div>

              <div className="payment-detail-body">
                <h3>Detail</h3>

                <div className="payment-detail-grid">
                  <span>Item</span>
                  <strong>{livePayment.packageName}</strong>

                  <span>{livePayment.playerIdLabel ?? 'ID User'}</span>
                  <strong>{livePayment.playerId}</strong>

                  {livePayment.zoneId ? (
                    <>
                      <span>{livePayment.secondaryFieldLabel ?? 'ID Zone'}</span>
                      <strong>{livePayment.zoneId}</strong>
                    </>
                  ) : null}

                  <span>Nomor Handphone</span>
                  <strong>{livePayment.whatsAppNumber}</strong>

                  <span>Reference</span>
                  <strong>{livePayment.reference}</strong>

                  {livePayment.resellerTrxid ? (
                    <>
                      <span>ID Trx Reseller</span>
                      <strong>{livePayment.resellerTrxid}</strong>
                    </>
                  ) : null}

                  <span>Harga</span>
                  <strong>{formatPrice(livePayment.packagePrice)}</strong>

                  <span>Fee</span>
                  <strong>{formatPrice(livePayment.paymentFee)}</strong>

                  <span>Kode Unik</span>
                  <strong>{formatPrice(uniqueCode)}</strong>
                </div>
              </div>

              <div className="payment-total-bar">
                <div>
                  <span>Total Pembayaran</span>
                  <strong>{formatPrice(livePayment.totalPrice)}</strong>
                </div>

                <button
                  type="button"
                  className="payment-copy-button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(String(livePayment.totalPrice));
                    } catch {
                      // no-op for unsupported clipboard environments
                    }
                  }}
                >
                  <Copy size={20} />
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentPage;

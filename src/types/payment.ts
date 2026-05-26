export interface PaymentDraft {
  orderId: string;
  createdAt: string;
  expiresAt: string;
  gameSlug: string;
  gameTitle: string;
  packageName: string;
  packagePrice: number;
  totalPrice: number;
  paymentBrand: string;
  paymentLabel: string;
  paymentFee: number;
  sellingPrice: number;
  resellerPrice?: number;
  playerId: string;
  playerIdLabel?: string;
  nickname?: string;
  zoneId: string;
  secondaryFieldLabel?: string;
  whatsAppNumber: string;
  packageGroup?: string;
  serviceCode?: string;
}

export interface PendingPayment extends PaymentDraft {
  invoiceId: string;
  merchantRef: string;
  reference: string;
  checkoutUrl?: string;
  qrUrl?: string;
  qrString?: string;
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'expired';
  paymentGatewayStatus?: string;
  resellerOrderStatus?: 'pending' | 'queued' | 'processed' | 'failed';
  resellerTrxid?: string;
}

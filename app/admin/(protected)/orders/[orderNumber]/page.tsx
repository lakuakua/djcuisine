import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ orderNumber: string }> | { orderNumber: string };
};

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

function getStatusColor(status: string) {
  switch (status) {
    case 'PAID':
      return 'bg-green-950/40 text-green-200 border-green-700/40';
    case 'SHIPPED':
      return 'bg-blue-950/40 text-blue-200 border-blue-700/40';
    case 'DELIVERED':
      return 'bg-emerald-950/40 text-emerald-200 border-emerald-700/40';
    case 'CANCELLED':
      return 'bg-red-950/40 text-red-200 border-red-700/40';
    default:
      return 'bg-stone-800/40 text-stone-200 border-stone-700/40';
  }
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { orderNumber } = await Promise.resolve(params);
  const order = await prisma.order.findUnique({
    where: { orderNumber: decodeURIComponent(orderNumber) },
  });

  if (!order) {
    notFound();
  }

  let lines: { description: string; quantity: number; amountTotalCents: number }[] = [];
  try {
    lines = JSON.parse(order.lineItemsJson) as typeof lines;
  } catch {
    lines = [];
  }

  let shipping: Record<string, unknown> | null = null;
  if (order.shippingJson) {
    try {
      shipping = JSON.parse(order.shippingJson) as Record<string, unknown>;
    } catch {
      shipping = null;
    }
  }

  const stripeDash = process.env.STRIPE_SECRET_KEY?.startsWith('sk_live')
    ? 'https://dashboard.stripe.com'
    : 'https://dashboard.stripe.com/test';

  const statusTimeline = [
    { status: 'PAID', label: 'Payment Received', icon: '✓' },
    { status: 'SHIPPED', label: 'Order Shipped', icon: '📦' },
    { status: 'DELIVERED', label: 'Delivered', icon: '🎉' },
  ];

  const currentStatusIndex = statusTimeline.findIndex((s) => s.status === order.status);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <p className="mb-4">
        <Link href="/admin/orders" className="text-gold-400 hover:text-gold-300 text-sm">
          ← All orders
        </Link>
      </p>
      <h1 className="text-3xl font-bold text-white font-mono mb-2">{order.orderNumber}</h1>
      <p className="text-stone-400 text-sm mb-6">
        {new Date(order.createdAt).toLocaleString()}
      </p>

      {/* Status Timeline */}
      <div className="rounded-lg border border-stone-700 bg-stone-900/50 p-6 mb-6">
        <p className="text-stone-400 text-xs font-semibold mb-4 uppercase">Order Status</p>
        <div className="flex items-center gap-4">
          {statusTimeline.map((item, idx) => (
            <div key={item.status} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${
                  idx <= currentStatusIndex
                    ? 'bg-gold-500/20 border-gold-500 text-gold-300'
                    : 'bg-stone-800/20 border-stone-700 text-stone-500'
                }`}
              >
                {item.icon}
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-xs font-medium ${
                    idx <= currentStatusIndex ? 'text-gold-300' : 'text-stone-500'
                  }`}
                >
                  {item.label}
                </span>
                <span
                  className={`text-xs ${idx <= currentStatusIndex ? 'text-gold-200' : 'text-stone-600'}`}
                >
                  {item.status}
                </span>
              </div>
              {idx < statusTimeline.length - 1 && (
                <div className="hidden sm:block flex-1 h-0.5 mx-2 bg-stone-700" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="rounded-lg border border-stone-700 bg-stone-900/50 p-6 space-y-4 text-sm mb-6">
        <div className="flex items-center justify-between">
          <span className="text-stone-500">Status</span>
          <span className={`px-3 py-1 rounded text-xs font-medium border ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>
        <div>
          <span className="text-stone-500">Total</span>
          <p className="text-xl font-semibold text-white">
            {formatMoney(order.amountTotalCents, order.currency)}
          </p>
        </div>
        <div>
          <span className="text-stone-500">Customer email</span>
          <p className="text-stone-200">{order.customerEmail || '—'}</p>
        </div>
        <div>
          <span className="text-stone-500">Phone</span>
          <p className="text-stone-200">{order.customerPhone || '—'}</p>
        </div>
        <div>
          <span className="text-stone-500">Order Date</span>
          <p className="text-stone-200">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <div>
          <span className="text-stone-500">Checkout session</span>
          <p className="font-mono text-xs text-stone-300 break-all">{order.stripeCheckoutSessionId}</p>
        </div>
        {order.stripePaymentIntentId && (
          <div className="border-t border-stone-800 pt-4">
            <span className="text-stone-500">Stripe Payment</span>
            <p>
              <a
                href={`${stripeDash}/payments/${order.stripePaymentIntentId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-300 inline-flex items-center gap-2"
              >
                Open in Stripe Dashboard ↗
              </a>
            </p>
          </div>
        )}
      </div>

      {/* Shipping Info */}
      {shipping && (
        <div className="rounded-lg border border-stone-700 bg-stone-900/50 p-6 mb-6">
          <p className="text-stone-400 text-xs font-semibold mb-4 uppercase">Shipping Address</p>
          <div className="text-sm text-stone-200 space-y-1">
            {typeof shipping.name === 'string' && <p>{shipping.name}</p>}
            {typeof shipping.line1 === 'string' && <p>{shipping.line1}</p>}
            {typeof shipping.line2 === 'string' && <p>{shipping.line2}</p>}
            {typeof shipping.city === 'string' && (
              <p>
                {shipping.city}, {shipping.state as string} {shipping.postal_code as string}
              </p>
            )}
            {typeof shipping.country === 'string' && <p>{shipping.country}</p>}
          </div>
        </div>
      )}

      {/* Line Items */}
      <div className="rounded-lg border border-stone-700 bg-stone-900/50 p-6 mb-6">
        <p className="text-stone-400 text-xs font-semibold mb-4 uppercase">Order Items</p>
        <ul className="space-y-3">
          {lines.map((l, i) => (
            <li key={i} className="flex justify-between gap-4 border-b border-stone-800 pb-3">
              <span className="text-stone-200">{l.description}</span>
              <span className="text-stone-400 text-right whitespace-nowrap">
                ×{l.quantity} · {formatMoney(l.amountTotalCents, order.currency)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="rounded-lg border border-stone-700 bg-stone-900/50 p-6">
        <p className="text-stone-400 text-xs font-semibold mb-4 uppercase">Actions</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(order.orderNumber);
                alert('Order number copied!');
              }
            }}
            className="px-4 py-2 rounded-lg border border-stone-600 hover:border-stone-500 text-stone-200 hover:text-white text-sm transition"
          >
            Copy Order Number
          </button>
          <a
            href={`${stripeDash}/payments/${order.stripePaymentIntentId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-orange-600/20 hover:bg-orange-600/30 border border-orange-600/50 text-orange-300 text-sm transition"
          >
            View Stripe Payment
          </a>
          {order.status === 'PAID' && (
            <button
              onClick={() => alert('Shipping integration coming soon')}
              className="px-4 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 text-blue-300 text-sm transition"
            >
              Create Shipment
            </button>
          )}
          {order.status === 'SHIPPED' && (
            <button
              onClick={() => alert('Resend shipping email')}
              className="px-4 py-2 rounded-lg bg-green-600/20 hover:bg-green-600/30 border border-green-600/50 text-green-300 text-sm transition"
            >
              Resend Tracking Email
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

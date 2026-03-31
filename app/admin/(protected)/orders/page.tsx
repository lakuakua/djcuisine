import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(d);
}

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  const stripeDash = process.env.STRIPE_SECRET_KEY?.startsWith('sk_live')
    ? 'https://dashboard.stripe.com'
    : 'https://dashboard.stripe.com/test';

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-2">Orders</h1>
      <p className="text-stone-400 text-sm mb-8">
        Last {orders.length} paid checkout sessions (newest first).
      </p>

      {orders.length === 0 ? (
        <p className="text-stone-500 rounded-lg border border-stone-700 bg-stone-900/50 p-8 text-center">
          No orders yet. Complete a test checkout with webhooks enabled to see data here.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-stone-700">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-900 text-stone-400">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Stripe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-stone-900/80">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${encodeURIComponent(o.orderNumber)}`}
                      className="font-mono text-gold-400 hover:text-gold-300"
                    >
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-stone-300 whitespace-nowrap">
                    {formatDate(o.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-stone-300 max-w-[200px] truncate">
                    {o.customerEmail || '—'}
                  </td>
                  <td className="px-4 py-3 text-white">
                    {formatMoney(o.amountTotalCents, o.currency)}
                  </td>
                  <td className="px-4 py-3">
                    {o.stripePaymentIntentId ? (
                      <a
                        href={`${stripeDash}/payments/${o.stripePaymentIntentId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-400 hover:text-orange-300"
                      >
                        Payment
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

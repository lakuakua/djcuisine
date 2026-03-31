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

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <p className="mb-4">
        <Link href="/admin/orders" className="text-gold-400 hover:text-gold-300 text-sm">
          ← All orders
        </Link>
      </p>
      <h1 className="text-2xl font-bold text-white font-mono mb-2">{order.orderNumber}</h1>
      <p className="text-stone-400 text-sm mb-6">
        {new Date(order.createdAt).toLocaleString()}
      </p>

      <div className="rounded-lg border border-stone-700 bg-stone-900/50 p-6 space-y-4 text-sm">
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
          <span className="text-stone-500">Checkout session</span>
          <p className="font-mono text-xs text-stone-300 break-all">{order.stripeCheckoutSessionId}</p>
        </div>
        {order.stripePaymentIntentId && (
          <div>
            <span className="text-stone-500">Stripe</span>
            <p>
              <a
                href={`${stripeDash}/payments/${order.stripePaymentIntentId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-300"
              >
                Open payment in Stripe Dashboard
              </a>
            </p>
          </div>
        )}
        {shipping && (
          <div>
            <span className="text-stone-500">Shipping</span>
            <pre className="mt-1 text-xs text-stone-300 whitespace-pre-wrap bg-stone-950 p-3 rounded border border-stone-800">
              {JSON.stringify(shipping, null, 2)}
            </pre>
          </div>
        )}
        <div>
          <span className="text-stone-500">Line items</span>
          <ul className="mt-2 space-y-2">
            {lines.map((l, i) => (
              <li
                key={i}
                className="flex justify-between gap-4 border-b border-stone-800 pb-2">
                <span className="text-stone-200">{l.description}</span>
                <span className="text-stone-400 text-right">
                  ×{l.quantity} · {formatMoney(l.amountTotalCents, order.currency)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

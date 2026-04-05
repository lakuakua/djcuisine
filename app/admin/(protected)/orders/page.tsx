'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { Order } from '@prisma/client';

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

function getStatusColor(status: string) {
  switch (status) {
    case 'PAID':
      return 'bg-green-950/40 text-green-300 border-green-700/40';
    case 'SHIPPED':
      return 'bg-blue-950/40 text-blue-300 border-blue-700/40';
    case 'DELIVERED':
      return 'bg-emerald-950/40 text-emerald-300 border-emerald-700/40';
    case 'CANCELLED':
      return 'bg-red-950/40 text-red-300 border-red-700/40';
    default:
      return 'bg-stone-800/40 text-stone-300 border-stone-700/40';
  }
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(status)}`}>
      {status}
    </span>
  );
}

type OrdersPageProps = {
  orders: Order[];
  stripeDashboard: string;
};

function OrdersPageClient({ orders: initialOrders, stripeDashboard }: OrdersPageProps) {
  const searchParams = useSearchParams();
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || '');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>(
    (searchParams.get('sort') as any) || 'newest'
  );
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('q') || '');
  const [filteredOrders, setFilteredOrders] = useState(initialOrders);

  useEffect(() => {
    let result = [...initialOrders];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(query) ||
          o.customerEmail?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter((o) => o.status === statusFilter);
    }

    // Apply sorting
    switch (sortBy) {
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'highest':
        result.sort((a, b) => b.amountTotalCents - a.amountTotalCents);
        break;
      case 'lowest':
        result.sort((a, b) => a.amountTotalCents - b.amountTotalCents);
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    setFilteredOrders(result);
  }, [statusFilter, sortBy, searchQuery, initialOrders]);

  const stats = {
    total: initialOrders.length,
    paid: initialOrders.filter((o) => o.status === 'PAID').length,
    shipped: initialOrders.filter((o) => o.status === 'SHIPPED').length,
    delivered: initialOrders.filter((o) => o.status === 'DELIVERED').length,
    totalRevenue: initialOrders.reduce((sum, o) => sum + o.amountTotalCents, 0),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-2">Orders Dashboard</h1>
      <p className="text-stone-400 text-sm mb-8">Monitor payments and order status</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="rounded-lg border border-stone-700 bg-stone-900/50 p-4">
          <p className="text-stone-400 text-xs">Total Orders</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="rounded-lg border border-green-700/40 bg-green-950/20 p-4">
          <p className="text-green-300 text-xs">Paid</p>
          <p className="text-2xl font-bold text-green-200">{stats.paid}</p>
        </div>
        <div className="rounded-lg border border-blue-700/40 bg-blue-950/20 p-4">
          <p className="text-blue-300 text-xs">Shipped</p>
          <p className="text-2xl font-bold text-blue-200">{stats.shipped}</p>
        </div>
        <div className="rounded-lg border border-emerald-700/40 bg-emerald-950/20 p-4">
          <p className="text-emerald-300 text-xs">Delivered</p>
          <p className="text-2xl font-bold text-emerald-200">{stats.delivered}</p>
        </div>
        <div className="rounded-lg border border-gold-700/40 bg-gold-950/20 p-4">
          <p className="text-gold-300 text-xs">Revenue</p>
          <p className="text-2xl font-bold text-gold-200">{formatMoney(stats.totalRevenue, 'usd')}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="rounded-lg border border-stone-700 bg-stone-900/50 p-4 mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search order number or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 rounded-lg border border-stone-600 bg-stone-950 px-3 py-2 text-sm text-white placeholder-stone-500 focus:border-gold-500 focus:outline-none"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-stone-600 bg-stone-950 px-3 py-2 text-sm text-white focus:border-gold-500 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="PAID">Paid</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-lg border border-stone-600 bg-stone-950 px-3 py-2 text-sm text-white focus:border-gold-500 focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <p className="text-stone-500 rounded-lg border border-stone-700 bg-stone-900/50 p-8 text-center">
          No orders found. Try adjusting your filters or search query.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-stone-700">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-900 text-stone-400">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-stone-900/80">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${encodeURIComponent(o.orderNumber)}`}
                      className="font-mono text-gold-400 hover:text-gold-300"
                    >
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-4 py-3 text-stone-300 whitespace-nowrap">
                    {formatDate(o.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-stone-300 max-w-[200px] truncate">
                    {o.customerEmail || '—'}
                  </td>
                  <td className="px-4 py-3 text-white font-semibold">
                    {formatMoney(o.amountTotalCents, o.currency)}
                  </td>
                  <td className="px-4 py-3">
                    {o.stripePaymentIntentId ? (
                      <a
                        href={`${stripeDashboard}/payments/${o.stripePaymentIntentId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-400 hover:text-orange-300 text-xs font-medium"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-stone-500 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-stone-500 text-xs mt-4">
        Showing {filteredOrders.length} of {stats.total} orders
      </p>
    </div>
  );
}

async function AdminOrdersPage() {
  const { prisma } = await import('@/lib/db/prisma');
  
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 500,
  });

  const stripeDash = process.env.STRIPE_SECRET_KEY?.startsWith('sk_live')
    ? 'https://dashboard.stripe.com'
    : 'https://dashboard.stripe.com/test';

  return <OrdersPageClient orders={orders} stripeDashboard={stripeDash} />;
}

export default AdminOrdersPage;

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Cart from '@/components/Cart';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, isJuiceOneGallonSize } from '@/lib/utils';
import { SHIPPING_CONFIG } from '@/lib/shipping';
import { US_STATE_CODES } from '@/lib/usStates';
import { getProductById } from '@/lib/products';
import { Loader2, Truck, MapPin } from 'lucide-react';
import type { QuoteBoxLine } from '@/lib/shipping/pirateShipParcelsForEasyship';

type QuoteRate = {
  service: string;
  cost: number;
  currency: string;
  estimatedDeliveryDate: string;
  transitDays: number;
};

export default function CheckoutPage() {
  const router = useRouter();
  const [cartOpen, setCartOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const getTotal = useCartStore((s) => s.getTotal);
  const getGallonCount = useCartStore((s) => s.getGallonCount);

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Shipping fields (only for shippable products)
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('TX');
  const [postalCode, setPostalCode] = useState('');

  const [quoteLoading, setQuoteLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [rates, setRates] = useState<QuoteRate[]>([]);
  const [isFallback, setIsFallback] = useState(false);
  const [fallbackForcedByEnv, setFallbackForcedByEnv] = useState(false);
  const [usedConsolidatedParcel, setUsedConsolidatedParcel] = useState(false);
  const [easyshipParcelCount, setEasyshipParcelCount] = useState<number | null>(null);
  const [parcelCount, setParcelCount] = useState<number | null>(null);
  const [liveAttemptError, setLiveAttemptError] = useState<string | null>(null);
  const [quoteBoxes, setQuoteBoxes] = useState<QuoteBoxLine[]>([]);
  const [perishableNotice, setPerishableNotice] = useState('');
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const subtotal = getTotal();
  const gallonCount = getGallonCount();
  const hasGallonMinimumIssue =
    items.some((item) => isJuiceOneGallonSize(item.selectedVariant.size)) && gallonCount < 2;

  // Check if cart contains ANY shippable products
  const hasShippableProducts = items.some((item) => {
    const product = getProductById(item.product.id);
    return !product?.pickupOnly;
  });

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/');
    }
  }, [items.length, router]);

  const fetchQuote = async () => {
    setError(null);
    setLiveAttemptError(null);
    if (!line1.trim() || !city.trim() || !postalCode.trim()) {
      setError('Please fill in street address, city, and ZIP code.');
      return;
    }
    setQuoteLoading(true);
    setRates([]);
    setQuoteBoxes([]);
    setSelectedService(null);
    try {
      const res = await fetch('/api/shipping/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: {
            firstName: firstName.trim() || 'Customer',
            lastName: lastName.trim() || 'Name',
            addressLine1: line1.trim(),
            addressLine2: line2.trim() || undefined,
            city: city.trim(),
            state: state.trim(),
            postalCode: postalCode.trim(),
            phone: phone.trim() || undefined,
            email: email.trim() || undefined,
          },
          items,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not get shipping rates');
      }
      setRates(data.rates || []);
      setIsFallback(!!data.isFallback);
      setFallbackForcedByEnv(!!data.fallbackForcedByEnv);
      setParcelCount(typeof data.parcelCount === 'number' ? data.parcelCount : null);
      setUsedConsolidatedParcel(!!data.usedConsolidatedParcel);
      setEasyshipParcelCount(typeof data.easyshipParcelCount === 'number' ? data.easyshipParcelCount : null);
      setLiveAttemptError(
        typeof data.liveAttemptError === 'string' ? data.liveAttemptError : null
      );
      setPerishableNotice(data.perishableNotice || '');
      setQuoteBoxes(Array.isArray(data.quoteBoxes) ? data.quoteBoxes : []);
      if (data.rates?.length) {
        setSelectedService(data.rates[0].service);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Quote failed');
    } finally {
      setQuoteLoading(false);
    }
  };

  const pay = async () => {
    setError(null);
    if (hasGallonMinimumIssue) {
      setError('Gallon orders require at least 2 gallons.');
      return;
    }
    if (!email.trim()) {
      setError('Email is required.');
      return;
    }

    // Validation based on pickup vs shipping
    if (hasShippableProducts && !selectedService) {
      setError('Select a shipping option. Click "Get shipping rates" first.');
      return;
    }

    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      setError('Name, phone, and email are required.');
      return;
    }

    setPayLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          email: email.trim(),
          shippingAddress: hasShippableProducts ? {
            firstName: firstName.trim() || 'Customer',
            lastName: lastName.trim() || 'Name',
            line1: line1.trim(),
            line2: line2.trim() || undefined,
            city: city.trim(),
            state: state.trim(),
            postalCode: postalCode.trim(),
            phone: phone.trim() || '7135550100',
          } : undefined,
          shippingService: hasShippableProducts ? selectedService : 'Local Pickup',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Checkout failed');
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error('No checkout URL');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Checkout failed');
    } finally {
      setPayLoading(false);
    }
  };

  const selectedRate = rates.find((r) => r.service === selectedService);
  const taxCents = Math.round(subtotal * SHIPPING_CONFIG.TAX_RATE);
  const shippingTotalCents = selectedRate ? Math.round(selectedRate.cost * 100) : 0;
  const orderTotalCents = subtotal + taxCents + (hasShippableProducts ? shippingTotalCents : 0);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-stone-950">
      <Header onCartOpen={() => setCartOpen(true)} />
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-orange-300/90">
          Checkout
        </p>
        <h1 className="mb-2 text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
          {hasShippableProducts ? 'Shipping & Payment' : 'Order Details'}
        </h1>
        <p className="mb-8 text-sm text-stone-400">
          {hasShippableProducts 
            ? 'Enter your delivery address, get live UPS rates, then pay securely with Stripe.'
            : 'Complete your local pickup order. We\'ll notify you when it\'s ready!'}
        </p>

        {hasGallonMinimumIssue && (
          <div className="mb-6 rounded-lg border border-red-600 bg-red-950/50 p-4 text-sm text-red-200">
            Gallon juices require a minimum of 2 gallons. You currently have {gallonCount} gallon
            line(s).{' '}
            <Link href="/shop" className="font-semibold underline">
              Add more
            </Link>
          </div>
        )}

        <div className="space-y-6 rounded-xl border border-red-900/40 bg-gradient-to-br from-stone-900 to-black p-6 shadow-xl">
          {/* Contact Information */}
          <div>
            <h2 className="text-sm font-semibold text-orange-200 mb-4">Contact Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-orange-200">Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-red-900/50 bg-stone-950 px-3 py-2 text-white placeholder-stone-500 focus:border-orange-500 focus:outline-none"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-orange-200">First name *</label>
                  <input
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-lg border border-red-900/50 bg-stone-950 px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-orange-200">Last name *</label>
                  <input
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-lg border border-red-900/50 bg-stone-950 px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-orange-200">Phone *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-red-900/50 bg-stone-950 px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                  autoComplete="tel"
                  placeholder="(713) 555-0100"
                />
              </div>
            </div>
          </div>

          {/* Shipping Information - Only for shippable products */}
          {hasShippableProducts && (
            <>
              <div className="border-t border-red-900/30 pt-4">
                <h2 className="text-sm font-semibold text-orange-200 mb-4 flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Shipping Address
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-orange-200">Street address *</label>
                    <input
                      required
                      value={line1}
                      onChange={(e) => setLine1(e.target.value)}
                      className="w-full rounded-lg border border-red-900/50 bg-stone-950 px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                      autoComplete="address-line1"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-orange-200">
                      Apt / suite (optional)
                    </label>
                    <input
                      value={line2}
                      onChange={(e) => setLine2(e.target.value)}
                      className="w-full rounded-lg border border-red-900/50 bg-stone-950 px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                      autoComplete="address-line2"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-1">
                      <label className="mb-1 block text-xs font-medium text-orange-200">City *</label>
                      <input
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full rounded-lg border border-red-900/50 bg-stone-950 px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                        autoComplete="address-level2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-orange-200">State *</label>
                      <select
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full rounded-lg border border-red-900/50 bg-stone-950 px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                        autoComplete="address-level1"
                      >
                        {US_STATE_CODES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-orange-200">ZIP *</label>
                      <input
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full rounded-lg border border-red-900/50 bg-stone-950 px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                        autoComplete="postal-code"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={fetchQuote}
                disabled={quoteLoading || hasGallonMinimumIssue}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-orange-600/50 bg-stone-900 py-3 font-semibold text-orange-200 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {quoteLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Truck className="h-5 w-5" />
                )}
                Get shipping rates
              </button>

              {rates.length > 0 && quoteBoxes.length > 0 && (
                <div className="rounded-lg border border-stone-700/80 bg-stone-950/50 p-3 text-xs">
                  <p className="mb-2 font-semibold text-orange-200/95">Boxes used for this shipping quote</p>
                  <ul className="space-y-2 text-stone-300">
                    {quoteBoxes.map((b, i) => (
                      <li
                        key={`${b.label}-${b.dimensions}-${i}`}
                        className="border-b border-stone-800/80 pb-2 last:border-0 last:pb-0"
                      >
                        <span className="font-semibold text-white">{b.tier}</span>
                        {b.label !== b.tier && (
                          <span className="text-stone-500"> · {b.label}</span>
                        )}
                        <div className="mt-0.5 text-stone-400">
                          {b.dimensions}
                          <span className="text-stone-500"> · {b.weightLb} lb (for rating)</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {usedConsolidatedParcel && (
                    <p className="mt-2 text-stone-500">
                      Easyship priced this as one consolidated parcel (dimensions above).
                    </p>
                  )}
                  {isFallback && (
                    <p className="mt-2 text-amber-200/80">
                      Zone estimate uses the same packing plan; live Easyship was unavailable.
                    </p>
                  )}
                </div>
              )}

              {isFallback && rates.length > 0 && (
                <p className="text-xs text-amber-300/95">
                  {fallbackForcedByEnv ? (
                    <>
                      Fallback rates only: set <code className="text-orange-200">USE_FALLBACK_RATES=false</code>{' '}
                      in <code className="text-orange-200">.env.local</code> and restart the dev server to use
                      live Easyship pricing.
                    </>
                  ) : (
                    <>
                      Showing zone estimates (Easyship live call failed).
                      {liveAttemptError ? (
                        <span className="mt-1 block font-mono text-[11px] text-amber-200/90">
                          {liveAttemptError}
                        </span>
                      ) : (
                        <span className="mt-1 block">
                          Check <code className="text-orange-200">EASYSHIP_API_KEY</code>, set{' '}
                          <code className="text-orange-200">EASYSHIP_ORIGIN_EMAIL</code> in{' '}
                          <code className="text-orange-200">.env.local</code>, and server logs — then try again.
                        </span>
                      )}
                    </>
                  )}
                </p>
              )}

              {perishableNotice && rates.length > 0 && (
                <p className="text-xs text-amber-200/90">{perishableNotice}</p>
              )}

              {(easyshipParcelCount != null || parcelCount != null) && (parcelCount ?? easyshipParcelCount ?? 0) > 0 && (
                <div className="rounded-lg border border-orange-600/30 bg-orange-950/20 p-4">
                  <p className="mb-2 text-xs font-semibold text-orange-300">📦 Box Details</p>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {usedConsolidatedParcel
                      ? `1 large consolidated box (24×20×20 in) — all items packed together.`
                      : `${easyshipParcelCount ?? parcelCount ?? 0} Pirate Ship box${(easyshipParcelCount ?? parcelCount ?? 0) !== 1 ? 'es' : ''}: `}
                    {!usedConsolidatedParcel && (
                      <span className="block mt-1 ml-2 text-stone-400">
                        Small (16×10×12), Medium (20×16×15), or Large (24×20×20) based on your order.
                      </span>
                    )}
                  </p>
                </div>
              )}

              {rates.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-orange-200">Choose speed</p>
                  {rates.map((r) => (
                    <label
                      key={r.service}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${
                        selectedService === r.service
                          ? 'border-orange-500 bg-orange-950/30'
                          : 'border-red-900/40 bg-stone-950/80'
                      }`}
                    >
                      <input
                        type="radio"
                        name="ship"
                        checked={selectedService === r.service}
                        onChange={() => setSelectedService(r.service)}
                        className="mt-1"
                      />
                      <div className="flex-1 text-sm">
                        <p className="font-semibold text-white">{r.service}</p>
                        <p className="text-stone-400">
                          Est. {new Date(r.estimatedDeliveryDate).toLocaleDateString()} ·{' '}
                          {r.transitDays} day(s) transit
                        </p>
                        <p className="mt-1 text-orange-200">
                          Carrier: {formatPrice(Math.round(r.cost * 100))}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Pickup-only notice */}
          {!hasShippableProducts && (
            <div className="rounded-lg border border-green-700/50 bg-green-950/40 p-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-300 text-sm mb-1">Local Pickup Order</p>
                  <p className="text-xs text-green-200/90">
                    Your order is pickup only. After payment, we'll notify you when it's ready for pickup at our Cypress location.
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-700 bg-red-950/40 p-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="border-t border-red-900/40 pt-4">
            <div className="mb-2 flex justify-between text-sm text-stone-400">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {hasShippableProducts && (
              <div className="mb-2 flex justify-between text-sm text-stone-400">
                <span>Shipping</span>
                <span>
                  {selectedRate
                    ? formatPrice(shippingTotalCents)
                    : '—'}
                </span>
              </div>
            )}
            <div className="mb-2 flex justify-between text-sm text-stone-400">
              <span>Tax</span>
              <span>{formatPrice(taxCents)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-white">
              <span>Total</span>
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                {hasShippableProducts
                  ? (selectedRate ? formatPrice(orderTotalCents) : formatPrice(subtotal + taxCents))
                  : formatPrice(orderTotalCents)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={pay}
            disabled={payLoading || hasGallonMinimumIssue || (hasShippableProducts && !selectedService)}
            className="w-full rounded-lg bg-gradient-to-r from-red-600 to-orange-500 py-4 text-lg font-bold text-white shadow-lg transition hover:from-red-500 hover:to-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {payLoading ? 'Redirecting to Stripe…' : 'Pay with Stripe'}
          </button>

          {hasShippableProducts && (
            <p className="text-center text-xs text-stone-500">
              Economy and 2-day quotes use Easyship (UPS or FedEx depending on your lane). Rates are verified again
              before payment.
            </p>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-stone-500">
          <Link href="/" className="text-orange-400 hover:underline">
            ← Back to home
          </Link>
        </p>
      </main>
    </div>
  );
}

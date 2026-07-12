'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Cart from '@/components/Cart';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { SHIPPING_CONFIG } from '@/lib/shipping';
import { LOCAL_PICKUP, SHIPPING_SERVICES } from '@/lib/constants/shipping';
import { isPickupYmdAllowed, minPickupDateYmd } from '@/lib/pickup/schedule';
import { US_STATE_CODES } from '@/lib/usStates';
import { getProductById } from '@/lib/products';
import { trackFacebookInitiateCheckout } from '@/lib/facebookPixel';
import { Loader2, Truck, MapPin } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';

type QuoteRate = {
  service: string;
  cost: number;
  currency: string;
  estimatedDeliveryDate: string;
  transitDays: number;
};

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function PaymentPanel({
  onConfirm,
  isProcessing,
  error,
  cardholderName,
  onCardholderNameChange,
}: {
  onConfirm: (stripe: ReturnType<typeof useStripe>, elements: ReturnType<typeof useElements>) => Promise<void>;
  isProcessing: boolean;
  error: string | null;
  cardholderName: string;
  onCardholderNameChange: (value: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const handleConfirm = async () => {
    if (!stripe || !elements) return;
    await onConfirm(stripe, elements);
  };

  return (
    <div className="space-y-4 rounded-lg border border-red-900/40 bg-stone-950/70 p-4">
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-stone-400">
          Cardholder name
        </label>
        <input
          type="text"
          value={cardholderName}
          onChange={(event) => onCardholderNameChange(event.target.value)}
          placeholder="Name on card"
          className="w-full rounded-md border border-stone-800 bg-black/30 px-3 py-3 text-sm text-stone-100 placeholder:text-stone-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
      </div>
      <div className="rounded-md border border-stone-800 bg-black/30 px-3 py-3">
        <CardNumberElement
          options={{
            disableLink: true,
            showIcon: true,
            style: {
              base: {
                color: '#f5f5f4',
                fontFamily: 'inherit',
                fontSize: '16px',
                '::placeholder': { color: '#a8a29e' },
              },
              invalid: { color: '#fca5a5' },
            },
          }}
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-md border border-stone-800 bg-black/30 px-3 py-3">
          <CardExpiryElement
            options={{
              style: {
                base: {
                  color: '#f5f5f4',
                  fontFamily: 'inherit',
                  fontSize: '16px',
                  '::placeholder': { color: '#a8a29e' },
                },
                invalid: { color: '#fca5a5' },
              },
            }}
          />
        </div>
        <div className="rounded-md border border-stone-800 bg-black/30 px-3 py-3">
          <CardCvcElement
            options={{
              style: {
                base: {
                  color: '#f5f5f4',
                  fontFamily: 'inherit',
                  fontSize: '16px',
                  '::placeholder': { color: '#a8a29e' },
                },
                invalid: { color: '#fca5a5' },
              },
            }}
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-200">{error}</p>}
      <button
        type="button"
        onClick={handleConfirm}
        disabled={!stripe || !elements || isProcessing}
        className="w-full rounded-lg bg-gradient-to-r from-red-600 to-orange-500 py-3 text-sm font-bold text-white shadow-lg transition hover:from-red-500 hover:to-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isProcessing ? 'Processing…' : 'Pay Now'}
      </button>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cartOpen, setCartOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const getTotal = useCartStore((s) => s.getTotal);

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [cardholderName, setCardholderName] = useState('');
  
  // Shipping fields (only for shippable products)
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('TX');
  const [postalCode, setPostalCode] = useState('');

  const [quoteLoading, setQuoteLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const [rates, setRates] = useState<QuoteRate[]>([]);
  const [perishableNotice, setPerishableNotice] = useState('');
  const [shippingZone, setShippingZone] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  /** YYYY-MM-DD from `input type="date"` — pickup-only orders */
  const [pickupDate, setPickupDate] = useState('');

  const pickupLeadValid = () =>
    Boolean(pickupDate.trim()) && isPickupYmdAllowed(pickupDate.trim(), Date.now());

  const subtotal = getTotal();

  useEffect(() => {
    trackFacebookInitiateCheckout();
  }, []);

  const forcePickup = searchParams.get('pickup') === '1';
  // Check if cart contains ANY shippable products
  const hasShippableProducts = !forcePickup && items.some((item) => {
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
    if (!line1.trim() || !city.trim() || !postalCode.trim()) {
      setError('Please fill in street address, city, and ZIP code.');
      return;
    }
    setQuoteLoading(true);
    setRates([]);
    setShippingZone(null);
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
      setPerishableNotice(data.perishableNotice || '');
      setShippingZone(typeof data.zone === 'string' ? data.zone : null);
      if (data.rates?.length) {
        setSelectedService(data.rates[0].service);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Quote failed');
    } finally {
      setQuoteLoading(false);
    }
  };

  const normalizePhone = (value: string) => value.replace(/\D/g, '');
  const isValidPhone = (value: string) => {
    const digits = normalizePhone(value);
    return digits.length === 10;
  };

  const createPaymentIntent = async () => {
    setError(null);
    setPaymentError(null);
    setPhoneError(null);
    if (!email.trim()) {
      setError('Email is required.');
      return;
    }

    if (hasShippableProducts && !selectedService) {
      setError('Select a shipping option. Click "Get shipping rates" first.');
      return;
    }

    if (!hasShippableProducts) {
      if (!pickupDate.trim()) {
        setError('Choose a pickup date at least 24 hours after your order.');
        return;
      }
      if (!isPickupYmdAllowed(pickupDate.trim(), Date.now())) {
        setError('Pickup date must be at least 24 hours after your order time.');
        return;
      }
    }

    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      setError('Name, phone, and email are required.');
      return;
    }
    if (!isValidPhone(phone)) {
      setPhoneError('Enter a valid 10-digit phone number.');
      return;
    }

    setPayLoading(true);
    try {
      const res = await fetch('/api/checkout/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          email: email.trim(),
          phone,
          shippingAddress: hasShippableProducts ? {
            firstName: firstName.trim() || 'Customer',
            lastName: lastName.trim() || 'Name',
            line1: line1.trim(),
            line2: line2.trim() || undefined,
            city: city.trim(),
            state: state.trim(),
            postalCode: postalCode.trim(),
            phone: normalizePhone(phone) || '7135550100',
          } : undefined,
          shippingService: hasShippableProducts ? selectedService : 'Local Pickup',
          pickupDate: !hasShippableProducts && pickupDate.trim() ? pickupDate.trim() : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Payment setup failed');
      }
      if (!data.clientSecret) {
        throw new Error('Missing payment intent');
      }
      setClientSecret(data.clientSecret);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Payment setup failed');
    } finally {
      setPayLoading(false);
    }
  };

  const confirmPayment = async (
    stripe: ReturnType<typeof useStripe>,
    elements: ReturnType<typeof useElements>
  ) => {
    if (!stripe || !elements) return;
    setPayLoading(true);
    setPaymentError(null);
    try {
      if (!hasShippableProducts) {
        if (!pickupDate.trim() || !pickupLeadValid()) {
          setPaymentError(
            'Pickup date must be at least 24 hours after your order. Choose a new date and use Continue to payment again.'
          );
          return;
        }
      }
      if (!clientSecret) {
        setPaymentError('Payment session expired. Please try again.');
        return;
      }
      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) {
        setPaymentError('Payment form not ready. Please try again.');
        return;
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: cardholderName.trim() || `${firstName} ${lastName}`.trim(),
            },
          },
        }
      );
      if (stripeError) {
        setPaymentError(stripeError.message || 'Payment failed');
        return;
      }
      if (paymentIntent?.status === 'succeeded') {
        router.push(`/success?payment_intent=${paymentIntent.id}`);
      }
    } catch (e: unknown) {
      setPaymentError(e instanceof Error ? e.message : 'Payment failed');
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
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setPhone(digitsOnly);
                    if (phoneError) setPhoneError(null);
                  }}
                  className="w-full rounded-lg border border-red-900/50 bg-stone-950 px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="7135550100"
                  maxLength={10}
                  pattern="\\d{10}"
                />
                {phoneError && <p className="mt-1 text-xs text-red-300">{phoneError}</p>}
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
                disabled={quoteLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-orange-600/50 bg-stone-900 py-3 font-semibold text-orange-200 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {quoteLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Truck className="h-5 w-5" />
                )}
                Get shipping rates
              </button>

              {shippingZone && rates.length > 0 && (
                <p className="text-xs text-stone-400">
                  Rate region: <span className="font-semibold text-orange-200/90">{shippingZone}</span> (Northeast,
                  Midwest, South, or West — from your state).
                </p>
              )}

              {perishableNotice && rates.length > 0 && (
                <p className="text-xs text-amber-200/90">{perishableNotice}</p>
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
                          {r.service === SHIPPING_SERVICES.UPS_GROUND
                            ? '2–3 business days transit'
                            : `${r.transitDays} day(s) transit`}
                        </p>
                        <p className="mt-1 text-orange-200">
                          Shipping: {formatPrice(Math.round(r.cost * 100))}
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
            <div className="space-y-4">
              <div className="rounded-lg border border-green-700/50 bg-green-950/40 p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-300 text-sm mb-1">Local Pickup Order</p>
                    <p className="text-xs text-green-200/90">
                      Your order is pickup only. Tap the field below to open the calendar and choose a date — the
                      earliest day available is 24 hours after your order so our kitchen can prepare (schedule is based
                      on Central Time for our Katy location).
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-green-200">
                  Preferred pickup date *
                </label>
                <input
                  type="date"
                  required
                  value={pickupDate}
                  min={minPickupDateYmd(Date.now())}
                  onChange={(e) => {
                    setPickupDate(e.target.value);
                    setClientSecret(null);
                  }}
                  className="w-full rounded-lg border border-green-800/60 bg-stone-950 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none [color-scheme:dark]"
                />
                <p className="mt-1 text-xs text-stone-500">
                  Earliest date shown is 24 hours after your order. 
                </p>
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

          {!clientSecret ? (
            <button
              type="button"
              onClick={createPaymentIntent}
              disabled={
                payLoading ||
                (hasShippableProducts && !selectedService) ||
                (!hasShippableProducts && !pickupLeadValid())
              }
              className="w-full rounded-lg bg-gradient-to-r from-red-600 to-orange-500 py-4 text-lg font-bold text-white shadow-lg transition hover:from-red-500 hover:to-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {payLoading ? 'Preparing payment…' : 'Continue to payment'}
            </button>
          ) : (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentPanel
                onConfirm={confirmPayment}
                isProcessing={payLoading}
                error={paymentError}
                cardholderName={cardholderName}
                onCardholderNameChange={setCardholderName}
              />
            </Elements>
          )}

          {hasShippableProducts && (
            <p className="text-center text-xs text-stone-500">
              UPS Ground and UPS 2nd Day Air amounts follow our regional rate sheet (per item × quantity). Totals match
              what you pay at checkout.
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

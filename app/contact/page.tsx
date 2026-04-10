'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900">
      <Header onCartOpen={() => setCartOpen(true)} />
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-gold-400 bg-clip-text text-transparent mb-4">
            Contact Us
          </h1>
          <p className="text-orange-200 text-xl max-w-2xl mx-auto">
            Get in touch with us for catering inquiries, orders, or any questions
          </p>
        </div>

        {/* Contact Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Phone */}
          <div className="bg-stone-800/70 border-2 border-red-700/50 rounded-lg p-8 shadow-xl hover:shadow-red-600/40 transition-all">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-600 to-orange-500 rounded-full flex items-center justify-center">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-orange-300 mb-2">Phone</h3>
                <a href="tel:+19792213114" className="text-orange-200 hover:text-red-400 transition-colors text-lg font-semibold">
                  (979) 221-3114
                </a>
                <p className="text-stone-400 text-sm mt-2">Call us for immediate assistance</p>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="bg-stone-800/70 border-2 border-red-700/50 rounded-lg p-8 shadow-xl hover:shadow-red-600/40 transition-all">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-600 to-orange-500 rounded-full flex items-center justify-center">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-orange-300 mb-2">Email</h3>
                <a href="mailto:orders@djcuisine.com" className="text-orange-200 hover:text-red-400 transition-colors text-lg font-semibold break-all">
                  orders@djcuisine.com
                </a>
                <p className="text-stone-400 text-sm mt-2">Email us your inquiries</p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-stone-800/70 border-2 border-red-700/50 rounded-lg p-8 shadow-xl hover:shadow-red-600/40 transition-all">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-600 to-orange-500 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-orange-300 mb-2">Location</h3>
                <p className="text-orange-200 text-lg font-semibold">
                  Richmond, Texas
                </p>
                <p className="text-stone-400 text-sm mt-2">Serving Houston and surrounding areas</p>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="bg-stone-800/70 border-2 border-red-700/50 rounded-lg p-8 shadow-xl hover:shadow-red-600/40 transition-all">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-600 to-orange-500 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-orange-300 mb-2">Order Anytime</h3>
                <p className="text-orange-200 text-lg font-semibold">
                  24/7 Online Ordering
                </p>
                <p className="text-stone-400 text-sm mt-2">24-hour notice required for all orders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wholesale beverages */}
        <div className="bg-gradient-to-br from-amber-950/50 to-stone-900/80 border-2 border-amber-700/40 rounded-xl p-8 mb-12 shadow-xl">
          <h2 className="text-2xl font-bold text-amber-200 mb-4">Wholesale beverages</h2>
          <p className="text-stone-200 leading-relaxed text-lg">
            For wholesale orders of our signature Pineapple Ginger and Zobo beverages, please contact us at{' '}
            <a
              href="mailto:Orders@djcuisine.com"
              className="font-semibold text-amber-300 underline decoration-amber-600/60 hover:text-amber-200"
            >
              Orders@djcuisine.com
            </a>{' '}
            or{' '}
            <a href="tel:+19792213114" className="font-semibold text-amber-300 underline decoration-amber-600/60 hover:text-amber-200">
              979-221-3114
            </a>
            .
          </p>
        </div>

        {/* Important Information */}
        <div className="bg-red-900/20 border-2 border-red-700/50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-4">
            Important Information
          </h2>
          <ul className="space-y-3 text-orange-200">
            <li className="flex items-start gap-3">
              <span className="text-red-400 font-bold">•</span>
              <span>24-hour notice required for all orders</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 font-bold">•</span>
              <span>BBQ on the spot and private dinners available - call for details</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 font-bold">•</span>
              <span>Catering services for weddings, birthdays, private dinners, and more</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 font-bold">•</span>
              <span>Nationwide shipping available via Stripe Checkout</span>
            </li>
          </ul>
        </div>

        {/* Event Types */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border-2 border-orange-600/50 rounded-xl p-8 shadow-2xl backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-orange-200 mb-4">We Cater Your Events</h2>
            <p className="text-2xl text-white tracking-wide">
              WEDDINGS • PRIVATE DINNERS • BIRTHDAYS • LOTS MORE...
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

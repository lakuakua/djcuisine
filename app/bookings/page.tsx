'use client';

import { useState, FormEvent } from 'react';
import Header from '@/components/Header';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';
import { Phone, Mail, MapPin, Calendar, Users, Send } from 'lucide-react';

export default function BookingsPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    eventType: '',
    guestCount: '',
    message: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit booking');
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventDate: '',
        eventType: '',
        guestCount: '',
        message: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900">
      <Header onCartOpen={() => setCartOpen(true)} />
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-gold-400 bg-clip-text text-transparent mb-4">
            Book Your Event
          </h1>
          <p className="text-orange-200 text-xl max-w-2xl mx-auto">
            Let us cater your special occasion with authentic flavors and professional service
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-8">
              Get in Touch
            </h2>

            <div className="bg-stone-800/70 border-2 border-red-700/50 rounded-lg p-6 shadow-xl hover:shadow-red-600/40 transition-all">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-600 to-orange-500 rounded-full flex items-center justify-center">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-orange-300 mb-2">Phone</h3>
                  <a
                    href="tel:+19792213114"
                    className="text-orange-200 hover:text-red-400 transition-colors text-lg font-semibold"
                  >
                    (979) 221-3114
                  </a>
                  <p className="text-stone-400 text-sm mt-2">Call us for immediate assistance</p>
                </div>
              </div>
            </div>

            <div className="bg-stone-800/70 border-2 border-red-700/50 rounded-lg p-6 shadow-xl hover:shadow-red-600/40 transition-all">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-600 to-orange-500 rounded-full flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-orange-300 mb-2">Email</h3>
                  <a
                    href="mailto:orders@djcuisine.com"
                    className="text-orange-200 hover:text-red-400 transition-colors text-lg font-semibold break-all"
                  >
                    orders@djcuisine.com
                  </a>
                  <p className="text-stone-400 text-sm mt-2">Email us your inquiries</p>
                </div>
              </div>
            </div>

            <div className="bg-stone-800/70 border-2 border-red-700/50 rounded-lg p-6 shadow-xl hover:shadow-red-600/40 transition-all">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-600 to-orange-500 rounded-full flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-orange-300 mb-2">Location</h3>
                  <p className="text-orange-200 text-lg font-semibold">Richmond, Texas</p>
                  <p className="text-stone-400 text-sm mt-2">
                    Serving Houston and surrounding areas
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-950/50 to-stone-900/80 border-2 border-amber-700/40 rounded-xl p-6">
              <h3 className="text-xl font-bold text-amber-200 mb-3">Event Types We Cater</h3>
              <ul className="space-y-2 text-stone-200">
                <li className="flex items-center gap-2">
                  <span className="text-red-400">•</span> Weddings & Receptions
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-400">•</span> Birthday Parties
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-400">•</span> Private Dinners
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-400">•</span> Corporate Events
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-400">•</span> BBQ on the Spot
                </li>
              </ul>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-stone-800/70 border-2 border-red-700/50 rounded-lg p-8 shadow-xl">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-8">
              Request a Quote
            </h2>

            {success && (
              <div className="mb-6 p-4 bg-green-900/30 border-2 border-green-700/50 rounded-lg">
                <p className="text-green-300 font-semibold">
                  Thank you! Your booking request has been submitted. We'll contact you shortly.
                </p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border-2 border-red-700/50 rounded-lg">
                <p className="text-red-300 font-semibold">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-orange-300 font-semibold mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-stone-900/80 border-2 border-stone-700 rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-orange-300 font-semibold mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-stone-900/80 border-2 border-stone-700 rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-orange-300 font-semibold mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-stone-900/80 border-2 border-stone-700 rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors"
                  placeholder="(123) 456-7890"
                />
              </div>

              <div>
                <label htmlFor="eventDate" className="block text-orange-300 font-semibold mb-2">
                  Event Date *
                </label>
                <input
                  type="date"
                  id="eventDate"
                  name="eventDate"
                  required
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-stone-900/80 border-2 border-stone-700 rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="eventType" className="block text-orange-300 font-semibold mb-2">
                  Event Type *
                </label>
                <select
                  id="eventType"
                  name="eventType"
                  required
                  value={formData.eventType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-stone-900/80 border-2 border-stone-700 rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors"
                >
                  <option value="">Select event type</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Birthday">Birthday Party</option>
                  <option value="Private Dinner">Private Dinner</option>
                  <option value="Corporate">Corporate Event</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="guestCount" className="block text-orange-300 font-semibold mb-2">
                  Number of Guests *
                </label>
                <input
                  type="number"
                  id="guestCount"
                  name="guestCount"
                  required
                  min="1"
                  value={formData.guestCount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-stone-900/80 border-2 border-stone-700 rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors"
                  placeholder="50"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-orange-300 font-semibold mb-2">
                  Additional Details
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-stone-900/80 border-2 border-stone-700 rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors resize-none"
                  placeholder="Tell us more about your event, dietary preferences, or special requests..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 disabled:from-gray-600 disabled:to-gray-500 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 shadow-xl shadow-red-500/50 hover:shadow-2xl hover:scale-105 disabled:cursor-not-allowed disabled:scale-100"
              >
                {loading ? (
                  'Submitting...'
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Submit Booking Request
                  </>
                )}
              </button>

              <p className="text-stone-400 text-sm text-center">
                * Required fields. 24-hour notice required for all orders.
              </p>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

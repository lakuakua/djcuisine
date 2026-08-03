'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';
import { Phone, Mail, Award, Flame, Heart } from 'lucide-react';

export default function MeetTheChefPage() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900">
      <Header onCartOpen={() => setCartOpen(true)} />
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-gold-400 bg-clip-text text-transparent mb-4">
            Meet the Chef
          </h1>
          <p className="text-orange-200 text-xl max-w-2xl mx-auto">
            The passion and expertise behind DJCUISINE
          </p>
        </div>

        {/* Chef Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Chef Photo with Stylized Frame */}
          <div className="relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative outer frame */}
              <div className="absolute -inset-4 bg-gradient-to-r from-red-600 via-orange-500 to-gold-500 rounded-2xl opacity-20 blur-2xl" />
              
              {/* Main frame with gradient border */}
              <div className="relative p-2 bg-gradient-to-r from-red-600 via-orange-500 to-gold-500 rounded-2xl shadow-2xl">
                {/* Inner border */}
                <div className="relative p-1 bg-stone-900 rounded-xl">
                  {/* Image container */}
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                    <Image
                      src="/images/chef.png"
                      alt="Chef Chardae"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>

              {/* Decorative corner accents */}
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-gold-400 rounded-tl-lg" />
              <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-gold-400 rounded-tr-lg" />
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-gold-400 rounded-bl-lg" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-gold-400 rounded-br-lg" />
            </div>
          </div>

          {/* Chef Bio */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Chef Chardae Hudson
            </h2>
            <p className="text-xl text-orange-300 font-semibold italic">
              Master of Authentic African & International Cuisine
            </p>

            <div className="space-y-4 text-stone-300 text-lg leading-relaxed">
              <p>
                With over 15 years of culinary excellence, Chef Chardae Hudson has become Houston's premier destination for authentic African and international BBQ and grilled cuisine. Her passion for traditional cooking methods and commitment to quality have earned DJCUISINE a reputation as "The Best BBQ in H-Town."
              </p>
              <p>
                Chef Chardae's journey began with a deep love for authentic flavors and traditional grilling techniques passed down through generations. She believes that true BBQ is an art form that requires patience, skill, and the finest ingredients.
              </p>
              <p>
                At DJCUISINE, we never use ovens. Every dish is prepared using traditional wood and charcoal smoking methods, ensuring that authentic smoky taste that keeps our customers coming back. From premium lamb and beef to fresh poultry and seafood, Chef Chardae personally oversees every preparation to guarantee excellence.
              </p>
            </div>

            {/* Achievements */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="bg-stone-800/70 backdrop-blur-sm rounded-lg p-4 border-2 border-red-900/40 text-center">
                <Award className="h-10 w-10 text-red-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-300">15+</p>
                <p className="text-stone-400 text-sm">Years Experience</p>
              </div>
              <div className="bg-stone-800/70 backdrop-blur-sm rounded-lg p-4 border-2 border-red-900/40 text-center">
                <Flame className="h-10 w-10 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-300">100%</p>
                <p className="text-stone-400 text-sm">Traditional Methods</p>
              </div>
              <div className="bg-stone-800/70 backdrop-blur-sm rounded-lg p-4 border-2 border-red-900/40 text-center">
                <Heart className="h-10 w-10 text-red-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-300">1000+</p>
                <p className="text-stone-400 text-sm">Happy Clients</p>
              </div>
            </div>
          </div>
        </div>

        {/* Signature Dishes */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-8 text-center">
            Signature Specialties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-stone-800/70 border-2 border-red-700/50 rounded-lg p-6 shadow-xl hover:shadow-red-600/40 transition-all">
              <h3 className="text-xl font-bold text-orange-300 mb-3">Premium Grilled Lamb</h3>
              <p className="text-stone-300">
                Marinated with authentic African spices and grilled to perfection over charcoal
              </p>
            </div>
            <div className="bg-stone-800/70 border-2 border-red-700/50 rounded-lg p-6 shadow-xl hover:shadow-red-600/40 transition-all">
              <h3 className="text-xl font-bold text-orange-300 mb-3">Smoked Turkey Wings</h3>
              <p className="text-stone-300">
                Slowly smoked with wood chips for that rich, tender, fall-off-the-bone texture
              </p>
            </div>
            <div className="bg-stone-800/70 border-2 border-red-700/50 rounded-lg p-6 shadow-xl hover:shadow-red-600/40 transition-all">
              <h3 className="text-xl font-bold text-orange-300 mb-3">Beef Kabobs</h3>
              <p className="text-stone-300">
                Juicy beef marinated in special seasoning, grilled with peppers and onions
              </p>
            </div>
          </div>
        </div>

        {/* Philosophy */}
        <div className="bg-gradient-to-br from-amber-950/50 to-stone-900/80 border-2 border-amber-700/40 rounded-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-amber-200 mb-4 text-center">
            Chef's Philosophy
          </h2>
          <p className="text-stone-200 text-lg leading-relaxed text-center max-w-3xl mx-auto">
            "Great food is more than just taste—it's about bringing people together, honoring traditions, and creating memories. Every dish we prepare at DJCUISINE is made with the same care and attention I'd give to my own family's table. That's the DJCUISINE difference."
          </p>
          <p className="text-orange-300 text-xl font-serif italic text-center mt-4">
            — Chef Chardae Hudson
          </p>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-stone-800/70 border-2 border-red-700/50 rounded-lg p-12 shadow-xl">
          <h2 className="text-4xl font-bold text-white mb-4">
            Experience Chef Chardae's Cuisine
          </h2>
          <p className="text-orange-200 text-lg mb-8 max-w-2xl mx-auto">
            Book Chef Chardae for your next event or order from our menu today
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/bookings"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white px-10 py-4 rounded-lg font-bold text-xl transition-all duration-200 shadow-xl shadow-red-500/50 hover:shadow-2xl hover:scale-105"
            >
              Book an Event
            </a>
            <a
              href="/shop"
              className="inline-flex items-center gap-2 bg-transparent border-2 border-red-600 hover:bg-red-600/10 text-red-400 hover:text-red-300 px-10 py-4 rounded-lg font-bold text-xl transition-all duration-200"
            >
              View Menu
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-stone-300">
            <a
              href="tel:+19792213114"
              className="inline-flex items-center gap-2 hover:text-red-400 transition-colors"
            >
              <Phone className="h-5 w-5" />
              (979) 221-3114
            </a>
            <a
              href="mailto:orders@djcuisine.com"
              className="inline-flex items-center gap-2 hover:text-red-400 transition-colors"
            >
              <Mail className="h-5 w-5" />
              orders@djcuisine.com
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

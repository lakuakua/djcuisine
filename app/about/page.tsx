'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';
import { Flame, Award, Heart, Users, Phone, Mail } from 'lucide-react';

export default function AboutPage() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-stone-950 to-black">
      <Header onCartOpen={() => setCartOpen(true)} />
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/beef ribs.jpg"
            alt="About DJCUISINE"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-gold-400 bg-clip-text text-transparent mb-6">
            About DJCUISINE
          </h1>
          <p className="text-2xl italic text-orange-200 font-serif mb-8">
            the best bbq in H-Town
          </p>
          <p className="text-xl text-stone-300 leading-relaxed">
            From intimate family dinners to large catering events, we bring the finest 
            grilled and smoked meats to your table. Premium lamb, beef, poultry, and fresh juices 
            made with authentic flavors and love.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent mb-8 text-center">
            Our Story
          </h2>
          <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
            <p>
              <span className="font-bold text-red-600">DJCUISINE</span> is a Houston-based catering and BBQ business specializing in 
              <span className="font-semibold text-orange-600"> authentic African & International cuisine</span>. 
              With over 15 years of experience, we've perfected the art of traditional grilling and smoking.
            </p>
            <p>
              Our meats are never oven-cooked. We use <span className="font-semibold text-red-600">traditional wood and charcoal smoking methods</span> that 
              give our dishes that rich, authentic smoky taste. This dedication to traditional cooking methods 
              ensures every bite is tender, moist, and bursting with flavor.
            </p>
            <p>
              From premium lamb and beef to fresh poultry and seafood, we bring authentic flavors to 
              weddings, private dinners, birthdays, and special events throughout the Houston area.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-stone-950 to-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-gold-400 bg-clip-text text-transparent mb-12 text-center">
            Why Choose DJCUISINE?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Experience */}
            <div className="bg-stone-950/60 backdrop-blur-sm rounded-lg p-6 border-2 border-red-900/40 text-center hover:scale-105 transition-all">
              <Award className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-orange-300 mb-2">15+ Years</h3>
              <p className="text-stone-400">Of culinary excellence and expertise</p>
            </div>

            {/* Traditional Methods */}
            <div className="bg-stone-950/60 backdrop-blur-sm rounded-lg p-6 border-2 border-red-900/40 text-center hover:scale-105 transition-all">
              <Flame className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-orange-300 mb-2">Traditional</h3>
              <p className="text-stone-400">Wood & charcoal grilling methods</p>
            </div>

            {/* Quality */}
            <div className="bg-stone-950/60 backdrop-blur-sm rounded-lg p-6 border-2 border-red-900/40 text-center hover:scale-105 transition-all">
              <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-orange-300 mb-2">100% Quality</h3>
              <p className="text-stone-400">Premium ingredients, authentic flavors</p>
            </div>

            {/* Community */}
            <div className="bg-stone-950/60 backdrop-blur-sm rounded-lg p-6 border-2 border-red-900/40 text-center hover:scale-105 transition-all">
              <Users className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-orange-300 mb-2">Full Service</h3>
              <p className="text-stone-400">From small to large events</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Experience the Best BBQ in H-Town?
          </h2>
          <p className="text-gray-700 text-lg mb-8">
            Contact us today to discuss your catering needs or place an order
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:+19792213114"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white px-10 py-4 rounded-lg font-bold text-xl transition-all duration-200 shadow-xl shadow-red-500/50 hover:shadow-2xl hover:scale-105"
            >
              <Phone className="h-5 w-5" />
              Call Now
            </a>
            <a
              href="mailto:orders@djcuisine.com"
              className="inline-flex items-center gap-2 bg-transparent border-2 border-red-600 hover:bg-red-600/10 text-red-600 px-10 py-4 rounded-lg font-bold text-xl transition-all duration-200"
            >
              <Mail className="h-5 w-5" />
              Email Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

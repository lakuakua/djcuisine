'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';
import CategorySection from '@/components/CategorySection';
import { ChefHat, Bird, Beef, Cookie, Fish, Flame, Drumstick, UtensilsCrossed, Coffee, ChevronRight } from 'lucide-react';

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Header onCartOpen={() => setCartOpen(true)} />
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Hero Section - Modern Clean Layout */}
      <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden">
        {/* Lamb Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/grilled lamb.jpg"
            alt="Grilled Lamb"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50 lg:bg-gradient-to-r lg:from-black/70 lg:via-black/50 lg:to-transparent"></div>
        </div>
        
        <div className="relative w-full px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-xl mx-auto lg:mx-0 lg:ml-0 text-center lg:text-left">
            {/* Main Heading */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">
              Premium Grilled & Smoked Meats
            </h1>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <a
                href="#categories"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white px-6 py-3 rounded-lg font-bold text-sm transition-all duration-200 shadow-xl shadow-red-500/50 hover:shadow-2xl hover:scale-105"
              >
                Shop Now
                <ChevronRight className="h-4 w-4" />
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-transparent border-2 border-white hover:bg-white/10 text-white px-6 py-3 rounded-lg font-bold text-sm transition-all duration-200"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-red-600 via-orange-500 to-red-600 bg-clip-text text-transparent mb-4">
              Our Menu
            </h2>
            <p className="text-gray-700 text-xl max-w-2xl mx-auto font-medium">
              Choose from our selection of catering trays, individual plates, or 
              refreshing beverages
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <CategorySection
              title="Chicken"
              description="Chicken legs & thighs, wings. Choose Big Tray, Half Tray, or Plate."
              href="/category/chicken"
              icon={<ChefHat className="h-12 w-12" />}
              image="/images/Chicken legs and thighs.png"
            />
            <CategorySection
              title="Turkey"
              description="Turkey wings and legs in Big Tray or Half Tray sizes."
              href="/category/turkey"
              icon={<Bird className="h-12 w-12" />}
              image="/images/Smoked Turkey wing.png"
            />
            <CategorySection
              title="Beef"
              description="Beef ribs, steak tips, and kabobs. Multiple sizes available."
              href="/category/beef"
              icon={<Beef className="h-12 w-12" />}
              image="/images/beef ribs.jpg"
            />
            <CategorySection
              title="Lamb"
              description="Premium lamb in Big Tray, Half Tray, or Plate."
              href="/category/lamb"
              icon={<Cookie className="h-12 w-12" />}
              image="/images/grilled lamb.jpg"
            />
            <CategorySection
              title="Seafood"
              description="Fresh grilled shrimp. Big Tray, Half Tray, or 5 Sticks."
              href="/category/seafood"
              icon={<Fish className="h-12 w-12" />}
              image="/images/shrimp on the stick.jpg"
            />
            <CategorySection
              title="Whole Poultry"
              description="Whole smoked and grilled rooster, guinea fowl, hen, and rabbit."
              href="/category/whole-poultry"
              icon={<Flame className="h-12 w-12" />}
              image="/images/Grilled Rooster.png"
            />
            <CategorySection
              title="Sausage"
              description="Grilled deer meat sausage - 5 pieces per order."
              href="/category/sausage"
              icon={<Drumstick className="h-12 w-12" />}
              image="/images/deer meat sausage 1.jpg"
            />
            <CategorySection
              title="Sides"
              description="Potatoes au gratin, corn, seafood noodles, mac & cheese, and fresh salads."
              href="/category/sides"
              icon={<UtensilsCrossed className="h-12 w-12" />}
              image="/images/sides/potatoes-au-gratin.jpg"
            />
            <CategorySection
              title="Juices"
              description="Zobo, pineapple ginger, and fresh tropical blends."
              href="/category/juices"
              icon={<Coffee className="h-12 w-12" />}
              image="/images/sides-menu.png"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-stone-800 via-stone-900 to-stone-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-gold-400 bg-clip-text text-transparent mb-6 drop-shadow-lg">
            Why Choose DJCUISINE?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 mb-12">
            <div className="bg-stone-800/70 backdrop-blur-sm rounded-lg p-8 border-2 border-red-700/50 shadow-xl hover:shadow-red-600/40 transition-all hover:scale-105">
              <div className="bg-gradient-to-r from-red-400 via-orange-400 to-gold-400 bg-clip-text text-transparent text-6xl font-bold mb-3">15+</div>
              <p className="text-orange-200 text-lg font-semibold">Years of Experience</p>
            </div>
            <div className="bg-stone-800/70 backdrop-blur-sm rounded-lg p-8 border-2 border-red-700/50 shadow-xl hover:shadow-red-600/40 transition-all hover:scale-105">
              <div className="bg-gradient-to-r from-red-400 via-orange-400 to-gold-400 bg-clip-text text-transparent text-6xl font-bold mb-3">100%</div>
              <p className="text-orange-200 text-lg font-semibold">Quality Ingredients</p>
            </div>
            <div className="bg-stone-800/70 backdrop-blur-sm rounded-lg p-8 border-2 border-red-700/50 shadow-xl hover:shadow-red-600/40 transition-all hover:scale-105">
              <div className="bg-gradient-to-r from-red-400 via-orange-400 to-gold-400 bg-clip-text text-transparent text-6xl font-bold mb-3">24/7</div>
              <p className="text-orange-200 text-lg font-semibold">Order Anytime</p>
            </div>
          </div>
          
          <a 
            href="/about"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white px-8 py-3 rounded-lg font-bold text-lg transition-all duration-200 shadow-xl shadow-red-500/50 hover:shadow-2xl hover:scale-105"
          >
            Learn More About Us
            <ChevronRight className="h-5 w-5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

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

      {/* Hero Section - Vibrant Modern Layout */}
      <section className="relative min-h-[500px] lg:min-h-[600px] flex items-center overflow-hidden">
        {/* Lamb Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/grilled lamb.jpg"
            alt="Grilled Lamb"
            fill
            className="object-cover brightness-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/30 to-transparent"></div>
        </div>
        
        <div className="relative w-full px-6 sm:px-8 lg:px-12 py-12 lg:py-16">
          <div className="max-w-3xl mx-auto text-center">
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-2xl">
              A Taste of Home in Every Bite
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-lg">
              Experience the rich flavors of authentic African & International cuisine, 
              grilled and smoked using traditional methods
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="#categories"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-8 py-4 rounded-lg font-bold text-base transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Order Now
                <ChevronRight className="h-5 w-5" />
              </a>
              <a
                href="/shop"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-8 py-4 rounded-lg font-bold text-base transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Catering Menu
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-lg font-bold text-base transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Event Booking
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
              image="/images/sides-menu.png"
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Why Choose DJCUISINE?
          </h2>
          <p className="text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
            Authentic flavors, traditional methods, exceptional service
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 mb-12">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all hover:scale-105 border border-gray-200">
              <div className="text-red-600 text-6xl font-bold mb-3">15+</div>
              <p className="text-gray-700 text-lg font-semibold">Years of Experience</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all hover:scale-105 border border-gray-200">
              <div className="text-orange-600 text-6xl font-bold mb-3">100%</div>
              <p className="text-gray-700 text-lg font-semibold">Quality Ingredients</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all hover:scale-105 border border-gray-200">
              <div className="text-green-600 text-6xl font-bold mb-3">24/7</div>
              <p className="text-gray-700 text-lg font-semibold">Order Anytime</p>
            </div>
          </div>
          
          <a 
            href="/about"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
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

'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';
import CategorySection from '@/components/CategorySection';
import { ChefHat, Bird, Beef, Sheep, Fish, Flame, Sausage, Coffee } from 'lucide-react';

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Header onCartOpen={() => setCartOpen(true)} />
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-black via-gray-900 to-black py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gold-400 mb-6">
            DJ Cuisine
          </h1>
          <p className="text-2xl sm:text-3xl text-gold-500 mb-8">
            Authentic African & International Cuisine
          </p>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-12">
            From intimate family dinners to large catering events, we bring the finest 
            grilled and smoked meats to your table. Premium lamb, beef, poultry, and fresh juices 
            made with authentic flavors and love.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#categories"
              className="bg-gold-600 hover:bg-gold-500 text-black px-8 py-4 rounded-lg font-bold text-lg transition-colors duration-200"
            >
              Order Now
            </a>
            <a
              href="tel:+1234567890"
              className="bg-transparent border-2 border-gold-600 hover:bg-gold-600 text-gold-400 hover:text-black px-8 py-4 rounded-lg font-bold text-lg transition-colors duration-200"
            >
              Call to Order
            </a>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-16 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gold-400 mb-4">
              Our Menu
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Choose from our selection of catering trays, individual plates, or 
              refreshing beverages
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CategorySection
              title="Chicken"
              description="Chicken legs & thighs, wings. Choose Big Tray, Half Tray, or Plate."
              href="/category/chicken"
              icon={<ChefHat className="h-12 w-12" />}
            />
            <CategorySection
              title="Turkey"
              description="Turkey wings and legs in Big Tray or Half Tray sizes."
              href="/category/turkey"
              icon={<Bird className="h-12 w-12" />}
            />
            <CategorySection
              title="Beef"
              description="Beef ribs, steak tips, and kabobs. Multiple sizes available."
              href="/category/beef"
              icon={<Beef className="h-12 w-12" />}
            />
            <CategorySection
              title="Lamb"
              description="Premium lamb in Big Tray, Half Tray, or Plate."
              href="/category/lamb"
              icon={<Sheep className="h-12 w-12" />}
            />
            <CategorySection
              title="Seafood"
              description="Fresh grilled shrimp. Big Tray, Half Tray, or 5 Sticks."
              href="/category/seafood"
              icon={<Fish className="h-12 w-12" />}
            />
            <CategorySection
              title="Whole Poultry"
              description="Whole smoked and grilled rooster, guinea fowl, hen, and rabbit."
              href="/category/whole-poultry"
              icon={<Flame className="h-12 w-12" />}
            />
            <CategorySection
              title="Sausage"
              description="Grilled deer meat sausage - 5 pieces per order."
              href="/category/sausage"
              icon={<Sausage className="h-12 w-12" />}
            />
            <CategorySection
              title="Juices"
              description="Zobo, pineapple ginger, and fresh tropical blends."
              href="/category/juices"
              icon={<Coffee className="h-12 w-12" />}
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gold-400 mb-6">
            Why Choose DJ Cuisine?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div>
              <div className="text-gold-400 text-5xl font-bold mb-2">15+</div>
              <p className="text-gray-300">Years of Experience</p>
            </div>
            <div>
              <div className="text-gold-400 text-5xl font-bold mb-2">100%</div>
              <p className="text-gray-300">Quality Ingredients</p>
            </div>
            <div>
              <div className="text-gold-400 text-5xl font-bold mb-2">24/7</div>
              <p className="text-gray-300">Order Anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

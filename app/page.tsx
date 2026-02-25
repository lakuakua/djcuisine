'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';
import CategorySection from '@/components/CategorySection';
import { ChefHat, Bird, Beef, Cookie, Fish, Flame, Drumstick, UtensilsCrossed, Coffee } from 'lucide-react';

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Header onCartOpen={() => setCartOpen(true)} />
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Hero Section with Image Gallery */}
      <section className="relative bg-gradient-to-b from-gray-900 via-black to-gray-900 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/images/Chicken%20legs%20and%20thighs.png')] bg-cover bg-center blur-sm"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          {/* Hero Content */}
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gold-400 mb-6 drop-shadow-lg">
              DJCUISINE
            </h1>
            <p className="text-2xl sm:text-3xl text-gold-500 mb-4">
              Authentic African & International Cuisine
            </p>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
              From intimate family dinners to large catering events, we bring the finest 
              grilled and smoked meats to your table. Premium lamb, beef, poultry, and fresh juices 
              made with authentic flavors and love.
            </p>
            
            {/* Important Notices */}
            <div className="max-w-4xl mx-auto space-y-3 mb-8">
              <div className="bg-gold-600/20 border-2 border-gold-600 rounded-lg p-4">
                <p className="text-gold-300 font-semibold text-lg">⏰ 24 Hour Notice Required for All Orders</p>
              </div>
              <div className="bg-blue-600/20 border-2 border-blue-500 rounded-lg p-4">
                <p className="text-blue-300 font-semibold">
                  🔥 BBQ On The Spot & Private Dinners Available • Call for Details
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#categories"
                className="bg-gold-600 hover:bg-gold-500 text-black px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-gold-600/50"
              >
                Order Now
              </a>
              <a
                href="tel:+19792213114"
                className="bg-transparent border-2 border-gold-600 hover:bg-gold-600 text-gold-400 hover:text-black px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200"
              >
                📞 (979) 221-3114
              </a>
            </div>
          </div>

          {/* Featured Images Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            <div className="relative h-48 rounded-lg overflow-hidden group">
              <img src="/images/Chicken%20legs%20and%20thighs.png" alt="Chicken Legs & Thighs" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <p className="text-white font-semibold text-sm">Chicken</p>
              </div>
            </div>
            <div className="relative h-48 rounded-lg overflow-hidden group">
              <img src="/images/beef%20ribs.jpg" alt="Beef Ribs" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <p className="text-white font-semibold text-sm">Beef Ribs</p>
              </div>
            </div>
            <div className="relative h-48 rounded-lg overflow-hidden group">
              <img src="/images/grilled%20lamb.jpg" alt="Grilled Lamb" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <p className="text-white font-semibold text-sm">Lamb</p>
              </div>
            </div>
            <div className="relative h-48 rounded-lg overflow-hidden group">
              <img src="/images/Smoked%20Turkey%20wing.png" alt="Turkey Wings" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <p className="text-white font-semibold text-sm">Turkey</p>
              </div>
            </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gold-400 mb-6">
              Why Choose DJCUISINE?
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

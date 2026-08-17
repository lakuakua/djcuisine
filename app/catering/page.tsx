'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Award, Flame, Heart, ChevronRight, X } from 'lucide-react';
import CateringNav from '@/components/CateringNav';
import CateringBookingForm from '@/components/CateringBookingForm';
import { chefBio } from '@/lib/chefBio';

const menuPages = Array.from({ length: 9 }, (_, i) => `/catering/menu/${i + 1}.jpg`);

export default function CateringPage() {
  const [selectedMenuPage, setSelectedMenuPage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 text-white">
      <CateringNav />

      {/* Hero */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/40 via-stone-950 to-orange-950/30" />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-gold-400">
            Private Chef · Events · Celebrations
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-gold-400 bg-clip-text text-transparent mb-6">
            DJCUISINE Catering
          </h1>
          <p className="text-xl text-stone-300 leading-relaxed max-w-2xl mx-auto mb-10">
            Personalized, restaurant-quality dining for weddings, private dinners, corporate events,
            and special occasions—crafted by Chef DJ with French, African, and Caribbean flavors.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#menu"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-xl shadow-red-500/40 hover:scale-105"
            >
              View Catering Menu
              <ChevronRight className="h-4 w-4" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 border-2 border-orange-500/60 hover:bg-orange-500/10 text-orange-200 px-8 py-3 rounded-lg font-bold transition-all"
            >
              Contact for Catering
            </a>
          </div>
        </div>
      </section>

      {/* Meet the Chef */}
      <section id="chef" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-red-950/40 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-4">
              Meet the Chef
            </h2>
            <p className="text-orange-200 text-lg">{chefBio.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-600 via-orange-500 to-gold-500 rounded-2xl opacity-20 blur-2xl" />
              <div className="relative p-2 bg-gradient-to-r from-red-600 via-orange-500 to-gold-500 rounded-2xl shadow-2xl">
                <div className="relative p-1 bg-stone-900 rounded-xl">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                    <Image
                      src="/images/chef.png"
                      alt={`${chefBio.name} - ${chefBio.title}`}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-gold-400 rounded-tl-lg" />
              <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-gold-400 rounded-tr-lg" />
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-gold-400 rounded-bl-lg" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-gold-400 rounded-br-lg" />
            </div>

            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-orange-300">{chefBio.name}</h3>
              <p className="text-stone-400 font-semibold">{chefBio.title}</p>
              <div className="space-y-4 text-stone-300 text-lg leading-relaxed">
                {chefBio.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                {chefBio.stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="bg-stone-800/70 rounded-lg p-4 border border-red-900/40 text-center"
                  >
                    {index === 0 && <Award className="h-8 w-8 text-red-500 mx-auto mb-2" />}
                    {index === 1 && <Flame className="h-8 w-8 text-orange-500 mx-auto mb-2" />}
                    {index === 2 && <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />}
                    <p className="text-xl font-bold text-orange-300">{stat.value}</p>
                    <p className="text-stone-400 text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catering Menu */}
      <section id="menu" className="py-20 px-4 sm:px-6 lg:px-8 bg-stone-900/50 border-t border-red-950/40 scroll-mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-4">
              Catering Menu
            </h2>
            <p className="text-stone-400 text-lg">
              Chef DJ Private Chef Menu — tap any page to enlarge
            </p>
          </div>

          <div className="space-y-6">
            {menuPages.map((src, index) => (
              <button
                key={src}
                type="button"
                onClick={() => setSelectedMenuPage(src)}
                className="relative w-full rounded-lg overflow-hidden border-2 border-red-800/40 shadow-xl hover:border-orange-500/50 transition-all hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <Image
                  src={src}
                  alt={`Catering menu page ${index + 1}`}
                  width={1200}
                  height={1600}
                  className="w-full h-auto"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-red-950/40 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-4">
              Contact Us for Catering
            </h2>
            <p className="text-orange-200 text-lg max-w-2xl mx-auto">
              Tell us about your event and we&apos;ll get back to you within 24 hours with a quote.
            </p>
          </div>
          <CateringBookingForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-red-900/30 py-8 px-4 text-center">
        <p className="text-stone-500 text-sm mb-4">
          &copy; {new Date().getFullYear()} DJCUISINE. All rights reserved.
        </p>
        <Link href="/" className="text-orange-400 hover:text-red-400 text-sm font-semibold transition-colors">
          Back to Shop
        </Link>
      </footer>

      {selectedMenuPage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedMenuPage(null)}
        >
          <button
            type="button"
            className="fixed top-4 right-4 text-white hover:text-red-400 z-10"
            onClick={() => setSelectedMenuPage(null)}
            aria-label="Close menu view"
          >
            <X className="h-8 w-8" />
          </button>
          <div className="relative max-w-3xl w-full my-8" onClick={(e) => e.stopPropagation()}>
            <Image
              src={selectedMenuPage}
              alt="Catering menu enlarged"
              width={1200}
              height={1600}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}

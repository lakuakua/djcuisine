'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Award, Flame, Heart, ChevronRight } from 'lucide-react';
import CateringNav from '@/components/CateringNav';
import CateringBookingForm from '@/components/CateringBookingForm';
import CateringMenuCard from '@/components/CateringMenuCard';
import { chefBio } from '@/lib/chefBio';
import { cateringMenu } from '@/lib/cateringMenu';

export default function CateringPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 text-white">
      <CateringNav />

      {/* Hero */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/40 via-stone-950 to-orange-950/30" />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-gold-400">
            Private Chef Services | Events &amp; Celebrations
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
      <section id="chef" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-red-950/40 scroll-mt-20">
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
              <div className="space-y-4 text-stone-300 text-lg leading-relaxed text-justify">
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
      <section id="menu" className="py-20 px-4 sm:px-6 lg:px-8 bg-stone-900/50 border-t border-red-950/40 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-4">
              Catering Menu
            </h2>
            <p className="inline-block max-w-2xl mb-4 rounded-2xl border border-gold-500/50 bg-stone-950/70 px-6 py-4 text-lg sm:text-xl font-semibold text-gold-200 shadow-lg shadow-black/40">
              Not sure what to choose? Let Chef DJ create a customize menu for your event.
            </p>
            <p className="text-stone-400 text-lg">
              Chef DJ&apos;s Private Menu, tap any page to enlarge
            </p>
          </div>

          <div className="space-y-8">
            {cateringMenu.map((section) => (
              <CateringMenuCard key={section.id} section={section} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-red-950/40 scroll-mt-20">
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

    </div>
  );
}

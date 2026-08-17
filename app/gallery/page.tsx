'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';
import { X, Play } from 'lucide-react';

const videos = [
  '/gallery/videos/Fire up your cravings! Our grill is serving bold flavors, smoky perfection, and juicy goodness i.mp4',
  '/gallery/videos/VID-20260531-WA0005.mp4',
  '/gallery/videos/VID-20260712-WA0001.mp4',
  '/gallery/videos/VID-20260720-WA0004.mp4',
  '/gallery/videos/VID-20260720-WA0005.mp4',
  '/gallery/videos/VID-20260720-WA0006.mp4',
  '/gallery/videos/VID-20260720-WA0007.mp4',
  '/gallery/videos/VID-20260720-WA0009.mp4',
  '/gallery/videos/VID-20260720-WA0010.mp4',
  '/gallery/videos/VID-20260720-WA0011.mp4',
  '/gallery/videos/VID-20260720-WA0012.mp4',
];

export default function GalleryPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900">
      <Header onCartOpen={() => setCartOpen(true)} />
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-gold-400 bg-clip-text text-transparent mb-4">
            Gallery
          </h1>
          <p className="text-orange-200 text-xl max-w-2xl mx-auto">
            Explore our authentic African & International cuisine in action
          </p>
        </div>

        <section>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-8 text-center">
            Behind the Scenes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((src) => (
              <div
                key={src}
                className="relative aspect-video bg-stone-800 rounded-lg overflow-hidden border-2 border-red-700/50 shadow-xl hover:shadow-red-600/40 transition-all hover:scale-105 cursor-pointer group"
                onClick={() => setSelectedVideo(src)}
              >
                <video
                  src={src}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="h-8 w-8 text-white ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-red-400 transition-colors z-10"
            onClick={() => setSelectedVideo(null)}
          >
            <X className="h-8 w-8" />
          </button>
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <video src={selectedVideo} controls autoPlay className="w-full rounded-lg" />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

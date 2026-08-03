'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';
import { X, Play } from 'lucide-react';

export default function GalleryPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const photos = [
    '/gallery/photos/file_00000000ab8481fd8bee9d0d2bddc339.png',
    '/gallery/photos/file_00000000a65481f8864935c6e1418bc1.png',
    '/gallery/photos/file_00000000b39881fdbfd030286565ad11.png',
    '/gallery/photos/file_00000000e8a881f5851964748acb3820.png',
    '/gallery/photos/file_00000000dde481fd8ea1606508a7672b.png',
    '/gallery/photos/file_00000000d70c81fd8cb32550448c19e4.png',
  ];

  const videos = [
    {
      src: '/gallery/videos/Fire up your cravings! Our grill is serving bold flavors, smoky perfection, and juicy goodness i.mp4',
      title: 'Fire up your cravings!',
    },
    { src: '/gallery/videos/VID-20260531-WA0005.mp4', title: 'Grilling Session' },
    { src: '/gallery/videos/VID-20260712-WA0000.mp4', title: 'BBQ Preparation' },
    { src: '/gallery/videos/VID-20260712-WA0001.mp4', title: 'Chef at Work' },
    { src: '/gallery/videos/VID-20260720-WA0004.mp4', title: 'Grilling Showcase' },
    { src: '/gallery/videos/VID-20260720-WA0005.mp4', title: 'Meat on the Grill' },
    { src: '/gallery/videos/VID-20260720-WA0006.mp4', title: 'BBQ Process' },
    { src: '/gallery/videos/VID-20260720-WA0007.mp4', title: 'Cooking Demo' },
    { src: '/gallery/videos/VID-20260720-WA0008.mp4', title: 'Food Preparation' },
    { src: '/gallery/videos/VID-20260720-WA0009.mp4', title: 'Grill Master' },
    { src: '/gallery/videos/VID-20260720-WA0010.mp4', title: 'Kitchen Action' },
    { src: '/gallery/videos/VID-20260720-WA0011.mp4', title: 'BBQ Session' },
    { src: '/gallery/videos/VID-20260720-WA0012.mp4', title: 'Cooking Show' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900">
      <Header onCartOpen={() => setCartOpen(true)} />
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-gold-400 bg-clip-text text-transparent mb-4">
            Gallery
          </h1>
          <p className="text-orange-200 text-xl max-w-2xl mx-auto">
            Explore our authentic African & International cuisine in action
          </p>
        </div>

        {/* Photos Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-8 text-center">
            Our Creations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="relative aspect-square bg-stone-800 rounded-lg overflow-hidden border-2 border-red-700/50 shadow-xl hover:shadow-red-600/40 transition-all hover:scale-105 cursor-pointer group"
                onClick={() => setSelectedImage(photo)}
              >
                <Image
                  src={photo}
                  alt={`Gallery photo ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
              </div>
            ))}
          </div>
        </section>

        {/* Videos Section */}
        <section>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-8 text-center">
            Behind the Scenes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <div
                key={index}
                className="relative aspect-video bg-stone-800 rounded-lg overflow-hidden border-2 border-red-700/50 shadow-xl hover:shadow-red-600/40 transition-all hover:scale-105 cursor-pointer group"
                onClick={() => setSelectedVideo(video.src)}
              >
                <video
                  src={video.src}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="h-8 w-8 text-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white font-semibold">{video.title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Image Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-red-400 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-8 w-8" />
          </button>
          <div className="relative max-w-6xl max-h-[90vh] w-full h-full">
            <Image
              src={selectedImage}
              alt="Selected photo"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* Video Modal */}
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
          <div className="relative max-w-5xl w-full">
            <video
              src={selectedVideo}
              controls
              autoPlay
              className="w-full rounded-lg"
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Kaushan_Script } from 'next/font/google';
import type { CateringMenuSection } from '@/lib/cateringMenu';

const script = Kaushan_Script({ weight: '400', subsets: ['latin'] });

interface CateringMenuCardProps {
  section: CateringMenuSection;
}

// The red of the "DJ" in the logo (mean #cf1e1b) cut with 10% orange, darkened
// and fading to black so the card stays calm behind the text.
const logoGradient =
  'linear-gradient(to bottom, #871c0e 0%, #4e1008 35%, #1e0603 70%, #000000 100%)';

export default function CateringMenuCard({ section }: CateringMenuCardProps) {
  const grainId = `menu-grain-${section.id}`;
  const panelId = `${section.id}-items`;
  const [open, setOpen] = useState(false);

  // Jumping here from the section list should reveal the items, not drop the
  // visitor on a collapsed card.
  useEffect(() => {
    const openIfTargeted = () => {
      if (window.location.hash === `#${section.id}`) {
        setOpen(true);
      }
    };
    openIfTargeted();
    window.addEventListener('hashchange', openIfTargeted);
    return () => window.removeEventListener('hashchange', openIfTargeted);
  }, [section.id]);

  return (
    <article
      id={section.id}
      className="scroll-mt-28 relative overflow-hidden rounded-2xl border border-red-950/70 shadow-2xl shadow-black/50"
    >
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0" style={{ backgroundImage: logoGradient }} />

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-15 mix-blend-soft-light"
        aria-hidden
      >
        <defs>
          <filter id={grainId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="5" seed="8" result="noise" />
            <feDiffuseLighting in="noise" lightingColor="#c8352f" surfaceScale="2.4">
              <feDistantLight azimuth="45" elevation="38" />
            </feDiffuseLighting>
          </filter>
        </defs>
        <rect width="100%" height="100%" filter={`url(#${grainId})`} />
      </svg>

      <div className="relative m-2 sm:m-3 rounded-xl border border-amber-100/15 p-5 sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-2 border-t-2 border-amber-100/25" />
        <div className="pointer-events-none absolute right-3 top-3 h-6 w-6 border-r-2 border-t-2 border-amber-100/25" />
        <div className="pointer-events-none absolute bottom-3 left-3 h-6 w-6 border-b-2 border-l-2 border-amber-100/25" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-2 border-r-2 border-amber-100/25" />

        <div className={open ? 'mb-7' : ''}>
          <button
            type="button"
            onClick={() => setOpen((isOpen) => !isOpen)}
            aria-expanded={open}
            aria-controls={panelId}
            className="flex w-full items-center justify-center gap-3"
          >
            <h3
              className={`${script.className} text-3xl sm:text-4xl text-[#ffedae] leading-tight`}
            >
              {section.title}
            </h3>
            <ChevronDown
              className={`h-6 w-6 flex-shrink-0 text-[#eeb16b] transition-transform ${
                open ? 'rotate-180' : ''
              }`}
            />
          </button>
          <span className="mx-auto mt-3 block h-px w-24 bg-amber-100/30" />
        </div>

        <div id={panelId} className={`space-y-8 ${open ? 'block' : 'hidden'}`}>
          {section.groups.map((group) => (
            <div key={group.heading ?? section.id}>
              {group.heading ? (
                <h4
                  className={`${script.className} text-2xl sm:text-3xl text-[#f4c98a] mb-4 text-center`}
                >
                  {group.heading}
                </h4>
              ) : null}
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
                {group.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[#fff6e0]">
                    <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#eeb16b]" />
                    <span className="text-[15px] sm:text-base font-medium leading-snug">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

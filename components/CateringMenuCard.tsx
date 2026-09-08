import { Kaushan_Script } from 'next/font/google';
import type { CateringMenuSection } from '@/lib/cateringMenu';

const script = Kaushan_Script({ weight: '400', subsets: ['latin'] });

interface CateringMenuCardProps {
  section: CateringMenuSection;
}

// Stops sampled from the DJCUISINE logo: cream-gold highlight down to the
// darkest maroon in the lettering. Laid over a dark base at partial opacity so
// the card stays calm behind the text.
const logoGradient =
  'linear-gradient(to bottom, #ffedae 0%, #f4c98a 6%, #eeb16b 13%, #d4804e 26%, #d24b30 45%, #c8352f 62%, #8a1a12 82%, #5b0000 100%)';

export default function CateringMenuCard({ section }: CateringMenuCardProps) {
  const grainId = `menu-grain-${section.id}`;

  return (
    <article
      id={section.id}
      className="scroll-mt-28 relative overflow-hidden rounded-2xl border border-red-950/70 shadow-2xl shadow-black/50"
    >
      <div className="absolute inset-0 bg-[#2a0806]" />
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: logoGradient }} />

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

        <div className="mb-7 text-center">
          <h3
            className={`${script.className} text-3xl sm:text-4xl text-[#ffedae] leading-tight`}
          >
            {section.title}
          </h3>
          <span className="mx-auto mt-3 block h-px w-24 bg-amber-100/30" />
        </div>

        <div className="space-y-8">
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

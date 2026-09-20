import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

interface CategorySectionProps {
  title: string;
  description: string;
  href: string;
  image?: string;
}

export default function CategorySection({
  title,
  description,
  href,
  image,
}: CategorySectionProps) {
  return (
    <Link
      href={href}
      className="group relative flex min-h-[13.5rem] flex-col overflow-hidden rounded-xl border-2 border-red-900/40 bg-gradient-to-br from-stone-950 to-black shadow-lg shadow-black/40 ring-1 ring-white/5 transition-all duration-300 hover:border-red-600 hover:shadow-2xl hover:shadow-red-700/40 hover:ring-gold-500/20"
    >
      {image && (
        <div className="absolute inset-0">
          <div className="relative h-full w-full">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover opacity-80 transition-all duration-500 group-hover:scale-110 group-hover:opacity-95"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-stone-950/50 to-transparent" />
        </div>
      )}

      <div className="relative mt-auto flex flex-1 flex-col justify-end p-5">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="mb-1.5 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-lg font-bold tracking-tight text-transparent drop-shadow-md sm:text-xl">
              {title}
            </h3>
            <p className="line-clamp-3 text-sm leading-snug text-orange-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {description}
            </p>
          </div>
          <ChevronRight
            className="h-5 w-5 shrink-0 text-orange-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-red-400"
            aria-hidden
          />
        </div>
      </div>
    </Link>
  );
}

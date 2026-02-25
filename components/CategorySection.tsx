import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

interface CategorySectionProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  image?: string;
}

export default function CategorySection({
  title,
  description,
  href,
  icon,
  image,
}: CategorySectionProps) {
  return (
    <Link
      href={href}
      className="group relative bg-gradient-to-br from-stone-950 to-black border-2 border-red-900/40 rounded-lg overflow-hidden hover:border-red-600 hover:shadow-2xl hover:shadow-red-700/40 transition-all duration-300 h-48 hover:scale-105"
    >
      {/* Background Image */}
      {image && (
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover opacity-80 group-hover:opacity-95 group-hover:scale-110 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-stone-950/50 to-transparent"></div>
        </div>
      )}
      
      {/* Content - Positioned at bottom */}
      <div className="relative h-full flex flex-col justify-end p-4">
        <div className="flex items-end justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">{title}</h3>
            <p className="text-orange-200 text-xs leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{description}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-orange-400 group-hover:text-red-400 group-hover:translate-x-1 transition-all drop-shadow-lg mb-1" />
        </div>
      </div>
    </Link>
  );
}

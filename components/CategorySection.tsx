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
      className="group relative bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 h-56 hover:scale-105 shadow-md border border-gray-200"
    >
      {/* Background Image */}
      {image && (
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover brightness-105 group-hover:scale-110 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>
      )}
      
      {/* Content - Positioned at bottom */}
      <div className="relative h-full flex flex-col justify-end p-5">
        <div className="flex items-end justify-between">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{title}</h3>
            <p className="text-white/90 text-sm leading-snug drop-shadow-md">{description}</p>
          </div>
          <ChevronRight className="h-6 w-6 text-white group-hover:translate-x-1 transition-all drop-shadow-lg mb-1" />
        </div>
      </div>
    </Link>
  );
}

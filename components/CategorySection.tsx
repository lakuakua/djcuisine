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
      className="group relative bg-gray-900 border-2 border-gold-800 rounded-xl overflow-hidden hover:border-gold-600 hover:shadow-2xl hover:shadow-gold-900/50 transition-all duration-300 h-80"
    >
      {/* Background Image */}
      {image && (
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30"></div>
        </div>
      )}
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="text-gold-400 mb-4 bg-black/70 rounded-full p-3 inline-flex shadow-lg">{icon}</div>
            <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">{title}</h3>
            <p className="text-gray-100 text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{description}</p>
          </div>
          <ChevronRight className="h-6 w-6 text-gold-400 group-hover:text-gold-300 group-hover:translate-x-1 transition-all drop-shadow-lg" />
        </div>
      </div>
    </Link>
  );
}

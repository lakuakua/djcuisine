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
            className="object-cover opacity-30 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        </div>
      )}
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="text-gold-400 mb-4 bg-black/50 rounded-full p-3 inline-flex">{icon}</div>
            <h3 className="text-2xl font-bold text-gold-300 mb-2 drop-shadow-lg">{title}</h3>
            <p className="text-gray-300 text-sm drop-shadow-md">{description}</p>
          </div>
          <ChevronRight className="h-6 w-6 text-gold-600 group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}

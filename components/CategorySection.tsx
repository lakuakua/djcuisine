import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface CategorySectionProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

export default function CategorySection({
  title,
  description,
  href,
  icon,
}: CategorySectionProps) {
  return (
    <Link
      href={href}
      className="group bg-gray-900 border-2 border-gold-800 rounded-xl p-8 hover:border-gold-600 hover:shadow-2xl hover:shadow-gold-900/50 transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-gold-400 mb-4">{icon}</div>
          <h3 className="text-2xl font-bold text-gold-300 mb-2">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
        <ChevronRight className="h-6 w-6 text-gold-600 group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}

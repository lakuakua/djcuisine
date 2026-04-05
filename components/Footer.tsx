export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-stone-950 via-black to-black border-t border-red-900/30 py-8 px-4 shadow-inner">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent font-bold text-lg mb-4">DJCUISINE</h3>
            <p className="italic text-orange-200 text-sm mb-2 font-semibold">
              the best bbq in H-Town
            </p>
            <p className="text-stone-400 text-sm">
              Serving Houston with authentic BBQ and catering since 2010.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/category/chicken" className="text-orange-300 hover:text-red-400 transition-colors">
                  Chicken
                </a>
              </li>
              <li>
                <a href="/category/beef" className="text-orange-300 hover:text-red-400 transition-colors">
                  Beef
                </a>
              </li>
              <li>
                <a href="/category/sides" className="text-orange-300 hover:text-red-400 transition-colors">
                  Sides
                </a>
              </li>
              <li>
                <a href="/category/juices" className="text-orange-300 hover:text-red-400 transition-colors">
                  Juices
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-orange-200">
              <li>
                <a href="tel:+19792213114" className="hover:text-red-400 transition-colors font-medium">
                  (979) 221-3114
                </a>
              </li>
              <li>
                <a href="mailto:orders@djcuisine.com" className="hover:text-red-400 transition-colors font-medium">
                  orders@djcuisine.com
                </a>
              </li>
              <li className="text-stone-400">
                Richmond, Texas
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-red-900/30 pt-6 text-center text-stone-400 text-sm">
          <p>&copy; {new Date().getFullYear()} DJCUISINE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

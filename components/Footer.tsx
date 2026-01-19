export default function Footer() {
  return (
    <footer className="bg-black border-t border-gold-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-gold-400 font-bold text-lg mb-4">DJ Cuisine</h3>
            <p className="text-gray-400 text-sm mb-2">
              The Best BBQ in H-Town
            </p>
            <p className="text-gray-500 text-sm">
              Serving Houston with authentic BBQ and catering since 2010.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gold-400 font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/category/big-trays" className="text-gray-400 hover:text-gold-400 transition-colors">
                  Big Trays
                </a>
              </li>
              <li>
                <a href="/category/plates" className="text-gray-400 hover:text-gold-400 transition-colors">
                  Plates
                </a>
              </li>
              <li>
                <a href="/category/juices" className="text-gray-400 hover:text-gold-400 transition-colors">
                  Juices
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gold-400 font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="tel:+1234567890" className="hover:text-gold-400 transition-colors">
                  (123) 456-7890
                </a>
              </li>
              <li>
                <a href="mailto:info@djcuisine.com" className="hover:text-gold-400 transition-colors">
                  info@djcuisine.com
                </a>
              </li>
              <li className="text-gray-500">
                Houston, TX
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gold-900 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} DJ Cuisine. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

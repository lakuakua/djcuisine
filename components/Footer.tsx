export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">DJCUISINE</h3>
            <p className="italic text-orange-400 text-sm mb-2 font-semibold">
              the best bbq in H-Town
            </p>
            <p className="text-gray-400 text-sm">
              Serving Houston with authentic BBQ and catering since 2010.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/#categories" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Our Menu
                </a>
              </li>
              <li>
                <a href="/shop" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Shop
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-orange-400 transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Important Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Important</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="font-medium text-orange-400">
                ⏰ 24 Hour Notice Required
              </li>
              <li>
                BBQ on the Spot Available
              </li>
              <li>
                Private Dinners & Catering
              </li>
              <li>
                <a href="/contact" className="hover:text-orange-400 transition-colors underline">
                  Contact Us for Details
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} DJCUISINE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

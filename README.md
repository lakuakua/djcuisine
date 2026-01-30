# DJ Cuisine - African & International Cuisine E-commerce

A production-ready e-commerce website for DJ Cuisine, Houston's premier African and International cuisine catering service.

## 🎯 Features

- **Next.js 14 App Router** - Modern React framework with server components
- **Tailwind CSS** - Utility-first styling with custom gold accent colors
- **TypeScript** - Full type safety throughout the application
- **Zustand** - Lightweight state management for shopping cart
- **Stripe Integration** - Secure payment processing
- **Cart Persistence** - Cart saved to localStorage
- **Mobile-First Design** - Responsive design that works on all devices
- **Business Logic** - Juice gallon minimums and tray pricing rules

## 📦 Product Categories

1. **Big Trays** - Premium catering trays serving 8-10 people (Chicken, Turkey, Beef, Lamb, Shrimp, Kabobs)
2. **Half Trays** - Perfect for smaller gatherings serving 4-5 people
3. **Plates & Specialties** - Individual servings, whole smoked/grilled poultry, deer meat sausage
4. **Juices** - Fresh natural beverages including Zobo, tropical blends, and healthy combinations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Stripe account (for payments)

### Installation

1. Clone the repository:
```bash
cd DJCUISINE
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Add your logo:

Place your logo at `/public/logo.png`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
DJCUISINE/
├── app/                      # Next.js App Router
│   ├── api/                 # API routes
│   │   └── checkout/        # Stripe checkout endpoint
│   ├── category/[slug]/     # Dynamic category pages
│   ├── success/             # Order success page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── Header.tsx           # Navigation header
│   ├── Cart.tsx             # Shopping cart drawer
│   ├── ProductCard.tsx      # Product display card
│   └── CategorySection.tsx  # Category link card
├── lib/                     # Utility functions
│   ├── products.ts          # Product data
│   └── utils.ts             # Helper functions
├── store/                   # State management
│   └── cartStore.ts         # Zustand cart store
├── types/                   # TypeScript definitions
│   └── index.ts             # Type definitions
└── public/                  # Static assets
    └── logo.png             # Business logo
```

## 💳 Stripe Setup

1. Create a [Stripe account](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Add keys to `.env.local`
4. Test with Stripe test card: `4242 4242 4242 4242`

## 🎨 Branding

- **Colors**: Black background with gold accents
- **Primary Gold**: `#ca8a04` (Tailwind gold-600)
- **Logo**: `/public/logo.png`
- **Tagline**: "The Best BBQ in H-Town"

## 📱 Features

### Shopping Cart
- Add/remove items
- Update quantities
- Persistent across sessions
- Real-time total calculation

### Business Rules
- **Juice Gallon Minimum**: Orders with 1-gallon juices require at least 2 gallons
- **Tray Pricing**: Small tray is automatically calculated as half the price of big tray

### Checkout Flow
1. Add items to cart
2. Review cart in drawer
3. Click checkout
4. Pay with Stripe
5. Success page with order confirmation

## 🔮 Future Enhancements

The codebase is structured to support:

- **Delivery & Pickup Scheduling** - Add time/date selection
- **Admin Dashboard** - Order management and inventory
- **User Accounts** - Order history and saved addresses
- **CMS Integration** - Dynamic product management (Sanity, Contentful)
- **Email Notifications** - Order confirmations via SendGrid/Mailgun
- **Analytics** - Google Analytics or Mixpanel integration

### Suggested Implementation Areas:

```
/app/admin/              # Admin dashboard
/app/account/            # User profile pages
/lib/email/              # Email service integration
/lib/database/           # Database models (Prisma/MongoDB)
```

## 🧪 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Other Platforms

Works with any platform supporting Next.js:
- Netlify
- AWS Amplify
- Digital Ocean
- Heroku

## 📝 Product Management

Products are currently stored in `/lib/products.ts`. To add/edit products:

1. Open `lib/products.ts`
2. Add/modify product objects
3. Ensure prices are in cents (e.g., $12.99 = 1299)
4. Add product images to `/public/images/`

## 🤝 Contributing

When adding features:

1. Keep code clean and commented
2. Follow existing TypeScript patterns
3. Test mobile responsiveness
4. Update this README

## 📞 Support

For questions or issues:
- Email: support@djcuisine.com
- Phone: (123) 456-7890

## 📄 License

Copyright © 2026 DJ Cuisine. All rights reserved.

---

Built with ❤️ in Houston, Texas

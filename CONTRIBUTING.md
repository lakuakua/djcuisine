# Contributing to DJ Cuisine

## Development Workflow

### Adding New Products

1. Open `/lib/products.ts`
2. Add product to the appropriate array (`bigTrays`, `plates`, or `juices`)
3. Follow this structure:

```typescript
{
  id: 'unique-id',
  name: 'Product Name',
  description: 'Product description',
  price: 1999, // Price in cents ($19.99)
  category: 'category-name',
  image: '/images/product-image.jpg'
}
```

### Adding New Categories

1. Update `types/index.ts` - add to `ProductCategory` type
2. Update `lib/products.ts` - create new array and add to `allProducts`
3. Create category page in `app/category/[slug]/page.tsx` - add to `categoryTitles` and `categoryDescriptions`
4. Add link in `components/Header.tsx` navigation
5. Add `CategorySection` on homepage

### Modifying Business Rules

Business logic is in:
- `/store/cartStore.ts` - Cart management
- `/components/Cart.tsx` - Gallon minimum validation
- `/app/api/checkout/route.ts` - Server-side validation

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow the color scheme:
  - Background: `bg-black`, `bg-gray-900`
  - Text: `text-gold-400`, `text-gold-300`, `text-gray-400`
  - Borders: `border-gold-800`, `border-gold-700`
- Mobile-first approach (design for mobile, then add `md:` and `lg:` breakpoints)

### Component Structure

```
components/
├── Header.tsx       - Navigation with cart icon
├── Footer.tsx       - Site footer
├── Cart.tsx         - Shopping cart drawer
├── ProductCard.tsx  - Product display card
└── CategorySection.tsx - Category link card
```

### API Routes

```
app/api/
└── checkout/
    └── route.ts     - Stripe checkout session creation
```

Future APIs to add:
- `/api/orders` - Order management
- `/api/admin` - Admin endpoints
- `/api/webhook` - Stripe webhook handler

## Code Quality

### Before Committing

1. **Run linter:**
   ```bash
   npm run lint
   ```

2. **Test build:**
   ```bash
   npm run build
   ```

3. **Check TypeScript:**
   All files should have proper types. No `any` types unless absolutely necessary.

### Best Practices

- Write descriptive commit messages
- Keep components small and focused
- Add comments for complex logic
- Ensure mobile responsiveness
- Test cart functionality after changes
- Verify Stripe integration in test mode

## Testing Checklist

Before pushing changes:

- [ ] Homepage loads correctly
- [ ] All category pages work
- [ ] Products can be added to cart
- [ ] Cart persists on page refresh
- [ ] Quantity updates work
- [ ] Remove from cart works
- [ ] Checkout button is clickable
- [ ] Stripe checkout loads
- [ ] Success page shows after payment
- [ ] Mobile menu works
- [ ] Mobile responsive on all pages

## Future Features to Implement

### High Priority
1. **Stripe Webhook Handler** - Confirm orders after payment
2. **Order Confirmation Emails** - SendGrid/Mailgun integration
3. **Admin Dashboard** - View and manage orders

### Medium Priority
4. **User Accounts** - Authentication with NextAuth
5. **Order History** - Track past orders
6. **Delivery Scheduling** - Time/date picker
7. **Pickup Options** - Store locations

### Low Priority
8. **Reviews/Ratings** - Customer feedback
9. **Favorites** - Save favorite items
10. **Promotions** - Discount codes

## File Organization

```
DJCUISINE/
├── app/                  # Next.js App Router
│   ├── api/             # API routes
│   ├── category/        # Category pages
│   ├── success/         # Success page
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Homepage
│   ├── globals.css      # Global styles
│   ├── loading.tsx      # Loading state
│   ├── error.tsx        # Error boundary
│   └── not-found.tsx    # 404 page
├── components/          # React components
├── lib/                 # Utilities & data
├── store/               # State management
├── types/               # TypeScript types
├── public/              # Static assets
│   ├── logo.png        # Logo
│   └── images/         # Product images
└── README.md           # Documentation
```

## Questions?

If you're unsure about something:
1. Check the README.md
2. Look at existing code examples
3. Test in development mode first
4. Ask the team

Happy coding! 🚀

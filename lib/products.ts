import { Product } from '@/types';

// CATEGORY 1: CHICKEN
export const chickenProducts: Product[] = [
  {
    id: 'chicken-leg-thighs',
    name: 'Chicken Leg & Thighs',
    description: 'Succulent chicken legs and thighs, perfectly seasoned and cooked to perfection.',
    category: 'chicken',
    image: '/images/chicken-leg-thighs.jpg',
    variants: [
      { id: 'big', size: 'Big Tray', price: 16000, servings: 'Serves 8-10 people' },
      { id: 'half', size: 'Half Tray', price: 8000, servings: 'Serves 4-5 people' },
      { id: 'plate', size: 'Plate', price: 2500, servings: '1 person with sides' }
    ]
  },
  {
    id: 'chicken-wings',
    name: 'Chicken Wings',
    description: 'Crispy and flavorful chicken wings with signature seasonings.',
    category: 'chicken',
    image: '/images/chicken-wings.jpg',
    variants: [
      { id: 'big', size: 'Big Tray', price: 18500, servings: 'Serves 8-10 people' },
      { id: 'half', size: 'Half Tray', price: 9300, servings: 'Serves 4-5 people' },
      { id: 'plate', size: 'Plate', price: 2500, servings: '1 person with sides' }
    ]
  }
];

// CATEGORY 2: TURKEY
export const turkeyProducts: Product[] = [
  {
    id: 'turkey-wings',
    name: 'Turkey Wings',
    description: 'Juicy smoked turkey wings with authentic flavors that fall off the bone.',
    category: 'turkey',
    image: '/images/turkey-wings.jpg',
    variants: [
      { id: 'big', size: 'Big Tray', price: 25000, servings: 'Serves 8-10 people' },
      { id: 'half', size: 'Half Tray', price: 12500, servings: 'Serves 4-5 people' }
    ]
  },
  {
    id: 'turkey-legs',
    name: 'Turkey Legs',
    description: 'Tender, smoky turkey legs expertly prepared with traditional seasonings.',
    category: 'turkey',
    image: '/images/turkey-legs.jpg',
    variants: [
      { id: 'big', size: 'Big Tray', price: 22000, servings: 'Serves 8-10 people' },
      { id: 'half', size: 'Half Tray', price: 11000, servings: 'Serves 4-5 people' }
    ]
  }
];

// CATEGORY 3: BEEF
export const beefProducts: Product[] = [
  {
    id: 'beef-ribs',
    name: 'Beef Ribs',
    description: 'Premium beef ribs, slow-cooked to perfection with rich, smoky flavor.',
    category: 'beef',
    image: '/images/beef-ribs.jpg',
    variants: [
      { id: 'big', size: 'Big Tray', price: 25000, servings: 'Serves 8-10 people' },
      { id: 'half', size: 'Half Tray', price: 12500, servings: 'Serves 4-5 people' },
      { id: 'plate', size: 'Plate', price: 2500, servings: '1 person with sides' }
    ]
  },
  {
    id: 'beef-steak-tips',
    name: 'Beef Steak Tips',
    description: 'Tender beef steak tips marinated with premium spices and grilled to perfection.',
    category: 'beef',
    image: '/images/beef-steak-tips.jpg',
    variants: [
      { id: 'big', size: 'Big Tray', price: 30000, servings: 'Serves 8-10 people' },
      { id: 'half', size: 'Half Tray', price: 15000, servings: 'Serves 4-5 people' },
      { id: 'plate', size: 'Plate', price: 2500, servings: '1 person with sides' }
    ]
  },
  {
    id: 'beef-kabob',
    name: 'Beef Kabob / Brochettes',
    description: 'Authentic beef kabobs with traditional African spices, flame-grilled to perfection.',
    category: 'beef',
    image: '/images/beef-kabob.jpg',
    variants: [
      { id: 'big', size: 'Big Tray', price: 30000, servings: 'Serves 8-10 people' },
      { id: 'half', size: 'Half Tray', price: 15000, servings: 'Serves 4-5 people' }
    ]
  }
];

// CATEGORY 4: LAMB
export const lambProducts: Product[] = [
  {
    id: 'lamb',
    name: 'Lamb',
    description: 'Premium lamb cuts, expertly marinated and grilled with authentic spices.',
    category: 'lamb',
    image: '/images/lamb.jpg',
    variants: [
      { id: 'big', size: 'Big Tray', price: 35000, servings: 'Serves 8-10 people' },
      { id: 'half', size: 'Half Tray', price: 17500, servings: 'Serves 4-5 people' },
      { id: 'plate', size: 'Plate', price: 3000, servings: '1 person with sides' }
    ]
  }
];

// CATEGORY 5: SEAFOOD
export const seafoodProducts: Product[] = [
  {
    id: 'shrimp',
    name: 'Shrimp',
    description: 'Fresh grilled shrimp with signature seasoning, perfectly cooked.',
    category: 'seafood',
    image: '/images/shrimp.jpg',
    variants: [
      { id: 'big', size: 'Big Tray', price: 30000, servings: 'Serves 8-10 people' },
      { id: 'half', size: 'Half Tray', price: 15000, servings: 'Serves 4-5 people' },
      { id: '5-sticks', size: '5 Sticks', price: 2000, servings: 'Individual serving' }
    ]
  }
];

// CATEGORY 6: WHOLE POULTRY
export const wholePoultryProducts: Product[] = [
  {
    id: 'smoked-rooster',
    name: 'Whole Smoked Rooster',
    description: 'Whole rooster, perfectly smoked with authentic African spices.',
    category: 'whole-poultry',
    image: '/images/smoked-rooster.jpg',
    isSingleSize: true,
    variants: [
      { id: 'whole', size: 'Whole', price: 3500, servings: 'Serves 2-3 people' }
    ]
  },
  {
    id: 'smoked-guinea-fowl',
    name: 'Whole Smoked Guinea Fowl',
    description: 'Whole guinea fowl, expertly smoked for maximum flavor.',
    category: 'whole-poultry',
    image: '/images/smoked-guinea-fowl.jpg',
    isSingleSize: true,
    variants: [
      { id: 'whole', size: 'Whole', price: 4500, servings: 'Serves 2-3 people' }
    ]
  },
  {
    id: 'smoked-hen',
    name: 'Whole Smoked Hen',
    description: 'Whole hen, slow-smoked to perfection with traditional seasonings.',
    category: 'whole-poultry',
    image: '/images/smoked-hen.jpg',
    isSingleSize: true,
    variants: [
      { id: 'whole', size: 'Whole', price: 3500, servings: 'Serves 2-3 people' }
    ]
  },
  {
    id: 'smoked-rabbit',
    name: 'Whole Smoked Rabbit',
    description: 'Whole rabbit, delicately smoked with traditional African seasonings.',
    category: 'whole-poultry',
    image: '/images/smoked-rabbit.jpg',
    isSingleSize: true,
    variants: [
      { id: 'whole', size: 'Whole', price: 7000, servings: 'Serves 2-3 people' }
    ]
  },
  {
    id: 'grilled-rooster',
    name: 'Whole Grilled Rooster',
    description: 'Whole rooster, char-grilled to perfection over open flame.',
    category: 'whole-poultry',
    image: '/images/grilled-rooster.jpg',
    isSingleSize: true,
    variants: [
      { id: 'whole', size: 'Whole', price: 3500, servings: 'Serves 2-3 people' }
    ]
  },
  {
    id: 'grilled-guinea-fowl',
    name: 'Grilled Guinea Fowl',
    description: 'Whole guinea fowl, flame-grilled with signature spices.',
    category: 'whole-poultry',
    image: '/images/grilled-guinea-fowl.jpg',
    isSingleSize: true,
    variants: [
      { id: 'whole', size: 'Whole', price: 4500, servings: 'Serves 2-3 people' }
    ]
  }
];

// CATEGORY 7: SAUSAGE
export const sausageProducts: Product[] = [
  {
    id: 'deer-sausage',
    name: 'Deer Meat Sausage',
    description: 'Five pieces of premium grilled deer meat sausage with authentic seasonings.',
    category: 'sausage',
    image: '/images/deer-sausage.jpg',
    isSingleSize: true,
    variants: [
      { id: '5-pieces', size: '5 Pieces', price: 2000, servings: 'Grilled, individual serving' }
    ]
  }
];

// CATEGORY 8 & 9: JUICES
export const juiceProducts: Product[] = [
  // Zobo (Category 8)
  {
    id: 'zobo',
    name: 'Zobo',
    description: 'Traditional hibiscus drink with natural sweetness and health benefits.',
    category: 'juices',
    image: '/images/zobo.jpg',
    variants: [
      { id: '1gal', size: '1 Gallon', price: 3500 },
      { id: 'half', size: 'Half Gallon', price: 1800 },
      { id: '16oz', size: '16 oz', price: 600 }
    ]
  },
  // Pineapple Ginger (Category 8)
  {
    id: 'pineapple-ginger',
    name: 'Pineapple Ginger',
    description: 'Refreshing pineapple juice with a zesty ginger kick.',
    category: 'juices',
    image: '/images/pineapple-ginger.jpg',
    variants: [
      { id: '1gal', size: '1 Gallon', price: 3500 },
      { id: 'half', size: 'Half Gallon', price: 1800 },
      { id: '16oz', size: '16 oz', price: 600 }
    ]
  },
  // Fresh Juice (Category 9 - Gallon only)
  {
    id: 'watermelon-ginger-pineapple',
    name: 'Watermelon, Ginger & Pineapple',
    description: 'Tropical blend of watermelon, ginger, and pineapple - refreshing and healthy.',
    category: 'juices',
    image: '/images/watermelon-ginger-pineapple.jpg',
    isSingleSize: true,
    variants: [
      { id: '1gal', size: '1 Gallon', price: 4000 }
    ]
  },
  {
    id: 'mango',
    name: 'Mango',
    description: 'Pure, sweet mango juice made from ripe, fresh mangoes.',
    category: 'juices',
    image: '/images/mango.jpg',
    isSingleSize: true,
    variants: [
      { id: '1gal', size: '1 Gallon', price: 4500 }
    ]
  },
  {
    id: 'orange',
    name: 'Orange',
    description: 'Freshly squeezed orange juice, packed with vitamin C.',
    category: 'juices',
    image: '/images/orange.jpg',
    isSingleSize: true,
    variants: [
      { id: '1gal', size: '1 Gallon', price: 4000 }
    ]
  },
  {
    id: 'watermelon',
    name: 'Watermelon',
    description: 'Pure watermelon juice, naturally sweet and hydrating.',
    category: 'juices',
    image: '/images/watermelon.jpg',
    isSingleSize: true,
    variants: [
      { id: '1gal', size: '1 Gallon', price: 4000 }
    ]
  },
  {
    id: 'mango-mandarin-pineapple',
    name: 'Mango Mandarin & Pineapple',
    description: 'Tropical fusion of mango, mandarin, and pineapple - a taste of paradise.',
    category: 'juices',
    image: '/images/mango-mandarin-pineapple.jpg',
    isSingleSize: true,
    variants: [
      { id: '1gal', size: '1 Gallon', price: 4000 }
    ]
  },
  {
    id: 'ginger-lemon-orange-pineapple',
    name: 'Ginger, Lemon, Orange & Pineapple',
    description: 'Zesty citrus blend with a healthy ginger twist - immune booster.',
    category: 'juices',
    image: '/images/ginger-lemon-orange-pineapple.jpg',
    isSingleSize: true,
    variants: [
      { id: '1gal', size: '1 Gallon', price: 4000 }
    ]
  },
  {
    id: 'carrot-apple-orange-ginger',
    name: 'Carrot, Apple, Orange & Ginger',
    description: 'Healthy blend of carrot, apple, orange, and ginger - packed with nutrients.',
    category: 'juices',
    image: '/images/carrot-apple-orange-ginger.jpg',
    isSingleSize: true,
    variants: [
      { id: '1gal', size: '1 Gallon', price: 4000 }
    ]
  }
];

// ALL PRODUCTS
export const allProducts: Product[] = [
  ...chickenProducts,
  ...turkeyProducts,
  ...beefProducts,
  ...lambProducts,
  ...seafoodProducts,
  ...wholePoultryProducts,
  ...sausageProducts,
  ...juiceProducts
];

export function getProductById(id: string): Product | undefined {
  return allProducts.find(p => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return allProducts.filter(p => p.category === category);
}

// Get all unique categories
export function getAllCategories(): string[] {
  return Array.from(new Set(allProducts.map(p => p.category)));
}

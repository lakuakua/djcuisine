import { Product } from '@/types';

// CATEGORY 1: CHICKEN
export const chickenProducts: Product[] = [
  {
    id: 'chicken-leg-thighs',
    name: 'Chicken Leg & Thighs',
    description: 'Succulent chicken legs and thighs, perfectly seasoned and cooked to perfection.',
    category: 'chicken',
    image: '/images/Chicken legs and thighs.png',
    variants: [
      { id: 'big', size: 'Big Tray', price: 16000, servings: 'Serves 20-30 people' },
      { id: 'half', size: 'Half Tray', price: 8000, servings: 'Serves 10-15 people' },
      { id: 'plate', size: 'Plate', price: 2500, servings: '1 person with sides' }
    ]
  },
  {
    id: 'chicken-wings',
    name: 'Chicken Wings',
    description: 'Crispy and flavorful chicken wings with signature seasonings.',
    category: 'chicken',
    image: '/images/grilled chicken wings.jpg',
    variants: [
      { id: 'big', size: 'Big Tray', price: 18500, servings: 'Serves 20-30 people' },
      { id: 'half', size: 'Half Tray', price: 9300, servings: 'Serves 10-15 people' },
      { id: 'plate', size: 'Plate', price: 2500, servings: '1 person with sides' }
    ]
  },
  {
    id: 'chicken-breast',
    name: 'Chicken Breast',
    description: 'Premium grilled chicken breast, tender and juicy with authentic seasonings.',
    category: 'chicken',
    image: '/images/Grilled Chicken breast 2.jpg',
    variants: [
      { id: 'big', size: 'Big Tray', price: 17000, servings: 'Serves 20-30 people' },
      { id: 'half', size: 'Half Tray', price: 8500, servings: 'Serves 10-15 people' }
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
    image: '/images/Smoked Turkey wing.png',
    variants: [
      { id: 'big', size: 'Big Tray', price: 25000, servings: 'Serves 20-30 people' },
      { id: 'half', size: 'Half Tray', price: 12500, servings: 'Serves 10-15 people' }
    ]
  },
  {
    id: 'turkey-legs',
    name: 'Turkey Legs',
    description: 'Tender, smoky turkey legs expertly prepared with traditional seasonings.',
    category: 'turkey',
    image: '/images/smoked turkey legs.jpg',
    variants: [
      { id: 'big', size: 'Big Tray', price: 22000, servings: 'Serves 20-30 people' },
      { id: 'half', size: 'Half Tray', price: 11000, servings: 'Serves 10-15 people' }
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
    image: '/images/beef ribs.jpg',
    variants: [
      { id: 'big', size: 'Big Tray', price: 25000, servings: 'Serves 20-30 people' },
      { id: 'half', size: 'Half Tray', price: 12500, servings: 'Serves 10-15 people' },
      { id: 'plate', size: 'Plate', price: 2500, servings: '1 person with sides' }
    ]
  },
  {
    id: 'beef-steak-tips',
    name: 'Beef Steak Tips',
    description: 'Tender beef steak tips marinated with premium spices and grilled to perfection.',
    category: 'beef',
    image: '/images/beef steak tips.jpg',
    variants: [
      { id: 'big', size: 'Big Tray', price: 30000, servings: 'Serves 20-30 people' },
      { id: 'half', size: 'Half Tray', price: 15000, servings: 'Serves 10-15 people' },
      { id: 'plate', size: 'Plate', price: 2500, servings: '1 person with sides' }
    ]
  },
  {
    id: 'beef-kabob',
    name: 'Beef Kabob / Brochettes',
    description: 'Authentic beef kabobs with traditional African spices, flame-grilled to perfection.',
    category: 'beef',
    image: '/images/Beef kabob.jpg',
    variants: [
      { id: 'big', size: 'Big Tray', price: 30000, servings: 'Serves 20-30 people' },
      { id: 'half', size: 'Half Tray', price: 15000, servings: 'Serves 10-15 people' }
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
    image: '/images/grilled lamb.jpg',
    variants: [
      { id: 'big', size: 'Big Tray', price: 35000, servings: 'Serves 20-30 people' },
      { id: 'half', size: 'Half Tray', price: 17500, servings: 'Serves 10-15 people' },
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
    image: '/images/shrimp on the stick.jpg',
    variants: [
      { id: 'big', size: 'Big Tray', price: 30000, servings: 'Serves 20-30 people' },
      { id: 'half', size: 'Half Tray', price: 15000, servings: 'Serves 10-15 people' },
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
    image: '/images/Smoked Whole Rooster.png',
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
    image: '/images/whole Smoked guinea fowl.png',
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
    image: '/images/whole smoked hen.jpg',
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
    image: '/images/whole smoked rabbit.jpg',
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
    image: '/images/Grilled Rooster.png',
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
    image: '/images/Grilled Guinea Fowl.png',
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
    image: '/images/deer meat sausage 1.jpg',
    isSingleSize: true,
    variants: [
      { id: '5-pieces', size: '5 Pieces', price: 2000, servings: 'Grilled, individual serving' }
    ]
  }
];

// CATEGORY 8: SIDES (FULL AND HALF PAN) — photos in /public/images/sides (from Assets/)
export const sidesProducts: Product[] = [
  {
    id: 'potatoes-au-gratin',
    name: 'Potatoes Au Gratin',
    description: 'Silken layers of potato folded with seasoned ground beef, cream and premium cheese, slow-baked to a bubbling, golden gratin.',
    category: 'sides',
    image: '/images/sides/potatoes-au-gratin.jpg',
    variants: [
      { id: 'full', size: 'Full Pan', price: 16000, servings: 'Serves 20-30 people' },
      { id: 'half', size: 'Half Pan', price: 8000, servings: 'Serves 10-15 people' }
    ]
  },
  {
    id: 'corn-on-the-cob',
    name: 'Corn On The Cob',
    description: 'Fresh corn on the cob slow-cooked in seasoned milk with traditional spices for deep, comforting flavor.',
    category: 'sides',
    image: '/images/sides/corn-on-the-cob.jpg',
    variants: [
      { id: 'full', size: 'Full Pan', price: 8500, servings: 'Serves 20-30 people' },
      { id: 'half', size: 'Half Pan', price: 4250, servings: 'Serves 10-15 people' }
    ]
  },
  {
    id: 'stir-fried-seafood-noodles',
    name: 'Stir Fried Seafood Noodles',
    description: 'Savory stir-fried noodles loaded with shrimp, calamari, and mussels. Sautéed with vegetables and tossed in a perfectly balanced soy-based sauce.',
    category: 'sides',
    image: '/images/sides/stir-fried-seafood-noodles.jpg',
    variants: [
      { id: 'full', size: 'Full Pan', price: 20000, servings: 'Serves 20-30 people' },
      { id: 'half', size: 'Half Pan', price: 10000, servings: 'Serves 10-15 people' }
    ]
  },
  {
    id: 'seafood-mac-and-cheese',
    name: 'Seafood Mac & Cheese',
    description: 'Decadent mac & cheese infused with a creamy blend of premium cheeses and tender seafood, baked until bubbly with a perfectly crisp finish.',
    category: 'sides',
    image: '/images/sides/seafood-mac-and-cheese.jpg',
    variants: [
      { id: 'full', size: 'Full Pan', price: 16000, servings: 'Serves 20-30 people' },
      { id: 'half', size: 'Half Pan', price: 8000, servings: 'Serves 10-15 people' }
    ]
  },
  {
    id: 'chef-dj-salad',
    name: "Chef DJ's Salad",
    description: 'Delicately diced cucumbers coated in a light, creamy mustard mayo dressing with a subtle tang.',
    category: 'sides',
    image: '/images/sides/chef-dj-salad.jpg',
    variants: [
      { id: 'full', size: 'Full Pan', price: 11000, servings: 'Serves 20-30 people' },
      { id: 'half', size: 'Half Pan', price: 5500, servings: 'Serves 10-15 people' }
    ]
  }
];

// CATEGORY 9: JUICES
export const juiceProducts: Product[] = [
  // Zobo - All sizes
  {
    id: 'zobo',
    name: 'Zobo',
    description: 'Traditional hibiscus drink with natural sweetness and health benefits. Choose sweetened or unsweetened.',
    category: 'juices',
    image: '/images/sides-menu.png',
    variants: [
      { id: '1gal', size: '1 Gallon', price: 3500 },
      { id: 'half', size: 'Half Gallon', price: 1800 },
      { id: '32oz', size: '32 oz Bottle', price: 1000 },
      { id: '16oz', size: '16 oz', price: 600 }
    ]
  },
  // Pineapple Ginger - All sizes
  {
    id: 'pineapple-ginger',
    name: 'Pineapple Ginger',
    description: 'Refreshing pineapple juice with a zesty ginger kick. Choose sweetened or unsweetened.',
    category: 'juices',
    image: '/images/sides-menu.png',
    variants: [
      { id: '1gal', size: '1 Gallon', price: 3500 },
      { id: 'half', size: 'Half Gallon', price: 1800 },
      { id: '32oz', size: '32 oz Bottle', price: 1000 },
      { id: '16oz', size: '16 oz', price: 600 }
    ]
  },
  // Fresh Juice (Gallon only)
  {
    id: 'watermelon-ginger-pineapple',
    name: 'Watermelon, Ginger & Pineapple',
    description: 'Tropical blend of watermelon, ginger, and pineapple - refreshing and healthy.',
    category: 'juices',
    image: '/images/sides-menu.png',
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
    image: '/images/sides-menu.png',
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
    image: '/images/sides-menu.png',
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
    image: '/images/sides-menu.png',
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
    image: '/images/sides-menu.png',
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
    image: '/images/sides-menu.png',
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
    image: '/images/sides-menu.png',
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
  ...sidesProducts,
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

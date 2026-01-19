import { Product } from '@/types';

export const bigTrays: Product[] = [
  {
    id: 'bt-ribs',
    name: 'BBQ Ribs Tray',
    description: 'Full rack of slow-smoked baby back ribs with our signature BBQ sauce. Serves 8-10 people.',
    price: 12999, // $129.99
    category: 'big-trays',
    isBigTray: true,
    image: '/images/ribs-tray.jpg'
  },
  {
    id: 'bt-brisket',
    name: 'Beef Brisket Tray',
    description: 'Tender, slow-smoked beef brisket sliced and ready to serve. Serves 8-10 people.',
    price: 14999, // $149.99
    category: 'big-trays',
    isBigTray: true,
    image: '/images/brisket-tray.jpg'
  },
  {
    id: 'bt-chicken',
    name: 'BBQ Chicken Tray',
    description: 'Juicy grilled chicken quarters with BBQ glaze. Serves 8-10 people.',
    price: 9999, // $99.99
    category: 'big-trays',
    isBigTray: true,
    image: '/images/chicken-tray.jpg'
  },
  {
    id: 'bt-pulled-pork',
    name: 'Pulled Pork Tray',
    description: 'Slow-smoked pulled pork with Carolina mustard sauce. Serves 8-10 people.',
    price: 11999, // $119.99
    category: 'big-trays',
    isBigTray: true,
    image: '/images/pulled-pork-tray.jpg'
  },
  {
    id: 'bt-sausage',
    name: 'Sausage Platter',
    description: 'Assorted smoked sausages with peppers and onions. Serves 8-10 people.',
    price: 8999, // $89.99
    category: 'big-trays',
    isBigTray: true,
    image: '/images/sausage-tray.jpg'
  },
  {
    id: 'bt-combo',
    name: 'BBQ Combo Tray',
    description: 'A mix of ribs, brisket, chicken, and pulled pork. Serves 10-12 people.',
    price: 17999, // $179.99
    category: 'big-trays',
    isBigTray: true,
    image: '/images/combo-tray.jpg'
  }
];

export const plates: Product[] = [
  {
    id: 'p-ribs',
    name: 'BBQ Ribs Plate',
    description: 'Half rack of ribs with two sides and cornbread.',
    price: 1899, // $18.99
    category: 'plates',
    image: '/images/ribs-plate.jpg'
  },
  {
    id: 'p-brisket',
    name: 'Beef Brisket Plate',
    description: 'Sliced brisket with two sides and cornbread.',
    price: 2099, // $20.99
    category: 'plates',
    image: '/images/brisket-plate.jpg'
  },
  {
    id: 'p-chicken',
    name: 'BBQ Chicken Plate',
    description: 'Quarter chicken with two sides and cornbread.',
    price: 1599, // $15.99
    category: 'plates',
    image: '/images/chicken-plate.jpg'
  },
  {
    id: 'p-pulled-pork',
    name: 'Pulled Pork Plate',
    description: 'Generous portion of pulled pork with two sides and cornbread.',
    price: 1699, // $16.99
    category: 'plates',
    image: '/images/pulled-pork-plate.jpg'
  },
  {
    id: 'p-sausage',
    name: 'Sausage Plate',
    description: 'Two sausage links with two sides and cornbread.',
    price: 1499, // $14.99
    category: 'plates',
    image: '/images/sausage-plate.jpg'
  },
  {
    id: 'p-combo',
    name: 'BBQ Combo Plate',
    description: 'Choice of two meats with two sides and cornbread.',
    price: 2299, // $22.99
    category: 'plates',
    image: '/images/combo-plate.jpg'
  }
];

export const juices: Product[] = [
  {
    id: 'j-lemonade-1gal',
    name: 'Fresh Lemonade',
    description: 'House-made fresh squeezed lemonade.',
    price: 1299, // $12.99
    category: 'juices',
    juiceSize: '1-gallon',
    image: '/images/lemonade.jpg'
  },
  {
    id: 'j-lemonade-half',
    name: 'Fresh Lemonade',
    description: 'House-made fresh squeezed lemonade.',
    price: 699, // $6.99
    category: 'juices',
    juiceSize: 'half-gallon',
    image: '/images/lemonade.jpg'
  },
  {
    id: 'j-lemonade-16oz',
    name: 'Fresh Lemonade',
    description: 'House-made fresh squeezed lemonade.',
    price: 399, // $3.99
    category: 'juices',
    juiceSize: '16oz',
    image: '/images/lemonade.jpg'
  },
  {
    id: 'j-sweet-tea-1gal',
    name: 'Sweet Tea',
    description: 'Traditional Southern sweet tea.',
    price: 999, // $9.99
    category: 'juices',
    juiceSize: '1-gallon',
    image: '/images/sweet-tea.jpg'
  },
  {
    id: 'j-sweet-tea-half',
    name: 'Sweet Tea',
    description: 'Traditional Southern sweet tea.',
    price: 549, // $5.49
    category: 'juices',
    juiceSize: 'half-gallon',
    image: '/images/sweet-tea.jpg'
  },
  {
    id: 'j-sweet-tea-16oz',
    name: 'Sweet Tea',
    description: 'Traditional Southern sweet tea.',
    price: 299, // $2.99
    category: 'juices',
    juiceSize: '16oz',
    image: '/images/sweet-tea.jpg'
  },
  {
    id: 'j-fruit-punch-1gal',
    name: 'Fruit Punch',
    description: 'Tropical fruit punch blend.',
    price: 1199, // $11.99
    category: 'juices',
    juiceSize: '1-gallon',
    image: '/images/fruit-punch.jpg'
  },
  {
    id: 'j-fruit-punch-half',
    name: 'Fruit Punch',
    description: 'Tropical fruit punch blend.',
    price: 649, // $6.49
    category: 'juices',
    juiceSize: 'half-gallon',
    image: '/images/fruit-punch.jpg'
  },
  {
    id: 'j-fruit-punch-16oz',
    name: 'Fruit Punch',
    description: 'Tropical fruit punch blend.',
    price: 349, // $3.49
    category: 'juices',
    juiceSize: '16oz',
    image: '/images/fruit-punch.jpg'
  }
];

export const allProducts: Product[] = [
  ...bigTrays,
  ...plates,
  ...juices
];

export function getProductById(id: string): Product | undefined {
  return allProducts.find(p => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return allProducts.filter(p => p.category === category);
}

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(priceInCents / 100);
}

export function formatJuiceSize(size?: string): string {
  if (!size) return '';
  
  switch (size) {
    case '1-gallon':
      return '1 Gallon';
    case 'half-gallon':
      return 'Half Gallon';
    case '16oz':
      return '16 oz';
    default:
      return size;
  }
}

export function formatServingSize(size?: string): string {
  if (!size) return '';
  
  switch (size) {
    case 'big-tray':
      return 'Big Tray';
    case 'half-tray':
      return 'Half Tray';
    case 'plate':
      return 'Plate';
    case 'whole':
      return 'Whole';
    case '5-sticks':
      return '5 Sticks';
    default:
      return size;
  }
}

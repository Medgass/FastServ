import { MenuItem } from '../../App';
import versaillesMenu from './versaillesCafeMenu.json';

// Convert Versailles Café menu to MenuItem format with support for dual pricing
export const menuItems: MenuItem[] = versaillesMenu.restaurant.categories.flatMap((category) =>
  category.items.map((item: any) => {
    const menuItem: MenuItem = {
      id: item.code?.toString() || `${category.id}-${item.name}`,
      name: item.name,
      description: '',
      price: item.price ? item.price / 1000 : (item.prices?.Said || 0) / 1000, // Convert millimes to TND
      category: category.name,
      image: item.image || 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=400',
      available: true,
    };
    
    // Add dual pricing options if they exist
    if (item.prices) {
      menuItem.options = [
        { name: 'Said', price: item.prices.Said / 1000 },
        { name: 'Nutella', price: item.prices.Nutella / 1000 }
      ];
    }
    
    return menuItem;
  })
);

// Categories organized by groups with "Tous" first
export const categoryGroups = {
  'ENTRÉES': ['PETIT DEJEUNER', 'OMELETTES'],
  'PLATS': ['BAGUETTE FARCIE', 'TACOS', 'PANINI', 'MA9LOUB', 'PIZZAS', 'CREPES SALÉS'],
  'DESSERTS': ['CREPES SUCRES', 'GAUFRE SUCRES', 'PANCAKES', 'GLACES', 'YAOURT GLACÉ'],
  'BOISSONS': ['CAFES', 'ACE COFFE', 'CAFE AROMATISES', 'CAFE GLACES', 'FRAPPUCCINO', 'MILKSHAKES', 'SMOOTHIES', 'COCKTAILS', 'MJITOS', 'JUS FRAIS', 'JUS GLACES', 'CHOCOLAT CHAUD', 'CHOCOLAT GLACÉ', 'THES', 'BOISSONS', 'CHICHA']
};

// Flatten all subcategories while preserving the group structure for UI
const allSubcategories = Object.values(categoryGroups).flat();

export const categories = ['Tous', ...allSubcategories];

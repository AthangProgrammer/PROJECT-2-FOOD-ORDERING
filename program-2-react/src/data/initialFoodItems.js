// Initial seed data so the food listing page is never completely empty on first load.
// Each item follows the same shape that the FoodEntryForm produces.

const initialFoodItems = [
  {
    id: 1,
    name: 'Margherita Pizza',
    description: 'Classic pizza topped with fresh tomato sauce, mozzarella and basil.',
    category: 'Pizza',
    price: '749',
  },
  {
    id: 2,
    name: 'Chicken Burger',
    description: 'Juicy grilled chicken breast in a toasted brioche bun with lettuce and mayo.',
    category: 'Burgers',
    price: '549',
  },
  {
    id: 3,
    name: 'Veg Spring Rolls',
    description: 'Crispy rolls stuffed with seasonal vegetables and served with sweet chilli dip.',
    category: 'Starters',
    price: '299',
  },
  {
    id: 4,
    name: 'Mango Lassi',
    description: 'Chilled yoghurt drink blended with ripe Alphonso mangoes.',
    category: 'Drinks',
    price: '149',
  },
  {
    id: 5,
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate sponge with a gooey molten centre, served with vanilla ice cream.',
    category: 'Desserts',
    price: '399',
  },
];

export default initialFoodItems;

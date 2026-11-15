// Optional: adds sample food items if the collection is empty.  Run: npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const Food = require('./models/Food');

const sample = [
  { name: 'Margherita Pizza', description: 'Classic pizza topped with fresh tomato sauce, mozzarella and basil.', category: 'Pizza', price: 749 },
  { name: 'Chicken Burger', description: 'Juicy grilled chicken breast in a toasted brioche bun with lettuce and mayo.', category: 'Burgers', price: 549 },
  { name: 'Veg Spring Rolls', description: 'Crispy rolls stuffed with seasonal vegetables and served with sweet chilli dip.', category: 'Starters', price: 299 },
  { name: 'Mango Lassi', description: 'Chilled yoghurt drink blended with ripe Alphonso mangoes.', category: 'Drinks', price: 149 },
  { name: 'Chocolate Lava Cake', description: 'Warm chocolate sponge with a gooey molten centre, served with vanilla ice cream.', category: 'Desserts', price: 399 },
  { name: 'Pasta Alfredo', description: 'Creamy white-sauce pasta with garlic, parmesan and herbs.', category: 'Pasta', price: 459 },
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  if ((await Food.countDocuments()) === 0) {
    await Food.insertMany(sample);
    console.log(`Inserted ${sample.length} food items`);
  } else {
    console.log('Food items already exist, nothing inserted');
  }
  await mongoose.disconnect();
})();

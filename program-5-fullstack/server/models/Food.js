const mongoose = require('mongoose');

const CATEGORIES = ['Pizza', 'Burgers', 'Starters', 'Drinks', 'Desserts', 'Pasta', 'Sushi', 'Other'];

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'name is required'], trim: true, minlength: [2, 'name must be at least 2 characters'] },
    description: { type: String, required: [true, 'description is required'], trim: true, minlength: [10, 'description must be at least 10 characters'] },
    category: { type: String, required: [true, 'category is required'], enum: { values: CATEGORIES, message: 'Invalid category' } },
    price: { type: Number, required: [true, 'price is required'], min: [1, 'price must be at least 1'], max: [99999, 'price must be less than 99999'] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // who added this item
  },
  { timestamps: true }
);

module.exports = mongoose.model('Food', foodSchema);

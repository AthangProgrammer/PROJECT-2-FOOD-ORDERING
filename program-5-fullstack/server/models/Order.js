const mongoose = require('mongoose');

// One line of an order. name and price are copied from the food at order time,
// so the order history stays correct even if the food is edited or deleted later.
const itemSchema = new mongoose.Schema(
  {
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [itemSchema], validate: [(v) => v.length > 0, 'An order needs at least one item'] },
    total: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Preparing', 'Delivered'], default: 'Pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

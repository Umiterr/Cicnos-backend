const Product = require("./product");
const User = require("./user");
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.Number,
    ref: User,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    date: new Date(),
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.Number,
        ref: Product,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("cart", cartSchema);

const mongoose = require("mongoose");
const Product = require("./product");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      images: [
        {
          id: Number,
          name: String,
          src: String,
          alt: String,
        },
      ],
      colors: [
        {
          name: String,
          bgColor: String,
          selectedColor: String,
        },
      ],
      description: String,
      details: [
        {
          name: String,
          items: [String],
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);

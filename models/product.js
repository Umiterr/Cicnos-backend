const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  price: String,
  stock: Number,
  category: String,
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
});

module.exports = mongoose.model("product", productSchema);

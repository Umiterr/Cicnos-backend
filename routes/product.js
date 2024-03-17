const express = require("express");
const router = express.Router();

const {
  getProductCategories,
  getProductsInCategory,
  getProduct,
  addProduct,
  editProduct,
  deleteProduct,
} = require("../controllers/product");

/* router.get("/", product.getAllProducts); */
router.get("/categories", getProductCategories);
router.get("/category/:category", getProductsInCategory);
router.get("/product/:id", getProduct);
router.post("/addProduct", addProduct);
router.put("/:id", editProduct);
router.patch("/:id", editProduct);
router.delete("/:id", deleteProduct);

module.exports = router;

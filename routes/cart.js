const express = require("express");
const router = express.Router();
const cart = require("../controllers/cart");

router.get("/userCart", cart.getCartProducts);

router.post("/", cart.addCart);

router.put("/:id", cart.editCart);
router.patch("/:id", cart.editCart);
router.post("/addProducts", cart.addProductsToCart);

module.exports = router;

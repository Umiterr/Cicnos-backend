const express = require("express");
const router = express.Router();
const cart = require("../controllers/cart");

router.get("/user/:userid", cart.getCartsbyUserid);

router.post("/", cart.addCart);

router.put("/:id", cart.editCart);
router.patch("/:id", cart.editCart);

module.exports = router;

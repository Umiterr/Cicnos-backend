const Cart = require("../models/cart");
const User = require("../controllers/users");
const mongoose = require("mongoose");

module.exports.getCartProducts = async (req, res) => {
  const { _id } = req.user;

  if (typeof req.body === "undefined" || _id == null) {
    return res.json({
      status: "error",
      message: "Something went wrong! Check your sent data",
    });
  }

  try {
    const userCart = await Cart.findOne({ userId: _id });

    if (!userCart) {
      return res.json({
        status: "error",
        message: "User's cart not found",
      });
    }

    const products = userCart.products;

    return res.status(200).json(products);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.addCart = async (req, res) => {
  const { _id } = req.user;

  try {
    if (typeof req.body === "undefined") {
      return res.json({
        status: "error",
        message: "data is undefined",
      });
    }

    // Crea el carrito y asígnalo al usuario
    const cart = new Cart({
      userId: `${_id}`,
      date: new Date(),
      products: [],
    });

    await cart.save();

    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while saving the cart.",
    });
  }
};

module.exports.editCart = (req, res) => {
  const { _id } = req.user;
  if (typeof req.body == undefined || _id == null) {
    res.json({
      status: "error",
      message: "something went wrong! check your sent data",
    });
  } else {
    res.json({
      id: parseInt(_id),
      userId: _id,
      date: req.body.date,
      products: req.body.products,
    });
  }
};

module.exports.addProductsToCart = async (req, res) => {
  const { _id } = req.user;

  if (typeof req.body === "undefined" || _id == null) {
    res.json({
      status: "error",
      message: "Something went wrong! Check your sent data",
    });
  } else {
    try {
      // Busca el carrito del usuario en la base de datos
      const userCart = await Cart.findOne({ userId: _id });

      if (!userCart) {
        return res.json({
          status: "error",
          message: "User's cart not found",
        });
      }

      // Agrega los nuevos productos al carrito del usuario
      for (const product of req.body.products) {
        product.productId = _id;
        userCart.products.push(product);
      }

      await userCart.save();

      // Actualiza la respuesta JSON con los productos del carrito actualizados
      return res.status(200).json({
        id: _id,
        userId: _id,
        date: req.body.date,
        products: userCart.products,
      });
    } catch (error) {
      console.error("Error adding products to cart:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
};

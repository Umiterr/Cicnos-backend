const Cart = require("../models/cart");
const User = require("../controllers/users");

module.exports.getCartsbyUserid = (req, res) => {
  const userId = req.params.userid;
  const startDate = req.query.startdate || new Date("1970-1-1");
  const endDate = req.query.enddate || new Date();

  console.log(startDate, endDate);
  Cart.find({
    userId,
    date: { $gte: new Date(startDate), $lt: new Date(endDate) },
  })
    .select("-_id -products._id")
    .then((carts) => {
      res.json(carts);
    })
    .catch((err) => console.log(err));
};

module.exports.addCart = async (req, res) => {
  const { _id } = req.user;

  const userId = _id;

  try {
    if (typeof req.body === "undefined") {
      return res.json({
        status: "error",
        message: "data is undefined",
      });
    }

    // Crea el carrito y asígnalo al usuario
    const cart = new Cart({
      userId: userId.toString(),
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

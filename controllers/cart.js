const Cart = require("../models/cart");

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
  try {
    if (typeof req.body === "undefined") {
      return res.json({
        status: "error",
        message: "data is undefined",
      });
    }

    // Busca el usuario por su ID
    const user = await User.findById(req.body.userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Crea el carrito y asígnalo al usuario
    const cart = new Cart({
      userId: user._id,
      date: new Date(),
      products: req.body.products,
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
  if (typeof req.body == undefined || req.params.id == null) {
    res.json({
      status: "error",
      message: "something went wrong! check your sent data",
    });
  } else {
    res.json({
      id: parseInt(req.params.id),
      userId: req.body.userId,
      date: req.body.date,
      products: req.body.products,
    });
  }
};

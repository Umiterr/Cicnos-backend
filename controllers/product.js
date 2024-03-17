const Product = require("../models/product");

module.exports.getAllProducts = (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  Product.find()
    .select(["-_id"])
    .limit(limit)
    .sort({ id: sort })
    .then((products) => {
      res.json(products);
    })
    .catch((err) => console.log(err));
};

module.exports.getProduct = (req, res) => {
  const id = req.params.id;

  Product.findOne({
    id,
  })
    .select(["-_id"])
    .then((product) => {
      res.json(product);
    })
    .catch((err) => console.log(err));
};

module.exports.getProductCategories = (req, res) => {
  Product.distinct("category")
    .then((categories) => {
      res.json(categories);
    })
    .catch((err) => console.log(err));
};

module.exports.getProductsInCategory = (req, res) => {
  const category = req.params.category;
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  Product.find({
    category,
  })
    .select(["-_id"])
    .limit(limit)
    .sort({ id: sort })
    .then((products) => {
      res.json(products);
    })
    .catch((err) => console.log(err));
};

module.exports.addProduct = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({
        message: "No se proporcionaron datos en el cuerpo de la solicitud.",
      });
    }
    // let productCount = 0;
    // Product.find()
    //   .countDocuments(function (err, count) {
    //     productCount = count;
    //   })
    //   .then(() => {
    const newProduct = await Product.create({
      id: req.body.id,
      name: req.body.title,
      price: req.body.price,
      stock: req.body.stock || 0, // Si no hay valor de stock, se establece como 0
      category: req.body.category,
      images: [
        {
          id: 1,
          name: "Main Image",
          src: req.body.image,
          alt: "Main image of the product",
        },
      ],
      colors: req.body.colors || [],
      description: req.body.description || "",
      details: req.body.details || [],
    });
    // product.save()
    //   .then(product => res.json(product))
    //   .catch(err => console.log(err))
    res.send(newProduct);
    // });
  } catch (err) {
    // Manejar errores adecuadamente
    console.error(err);
    res.status(500).send({ message: "Error interno del servidor." });
  }
};

module.exports.editProduct = (req, res) => {
  if (typeof req.body == undefined || req.params.id == null) {
    res.json({
      status: "error",
      message: "something went wrong! check your sent data",
    });
  } else {
    res.json({
      id: parseInt(req.params.id),
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      image: req.body.image,
      category: req.body.category,
    });
  }
};

module.exports.deleteProduct = (req, res) => {
  if (req.params.id == null) {
    res.json({
      status: "error",
      message: "cart id should be provided",
    });
  } else {
    Product.findOne({
      id: req.params.id,
    })
      .select(["-_id"])
      .then((product) => {
        res.json(product);
      })
      .catch((err) => console.log(err));
  }
};

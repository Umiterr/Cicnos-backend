const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const validator = require("validator");
const path = require("path");
const { celebrate, Joi, errors } = require("celebrate");

// creating an Express instance
const app = express();
require("dotenv").config();
const { NODE_ENV, PORT, JWT_SECRET } = process.env;

console.log(process.env.NODE_ENV);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routers

const userRouter = require("./routes/users");
const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const productRoute = require("./routes/product");
const { addProduct } = require("./controllers/product");

const cartRoute = require("./routes/cart");

// Routes

app.post("/signin", login);
app.post("/signup", createUser);

app.post("/addProduct", addProduct);

app.use(auth);

app.use("/products", productRoute);
app.use("/carts", cartRoute);

// Rutas de usuario
app.use(
  "/",

  userRouter
);

mongoose
  .connect("mongodb://localhost:27017/cicnos-database")
  .then(() => {
    console.log(`Conexión exitosa a la base de datos`);
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
  });

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Enlace al servidor en el puerto: ${PORT}`);
});

app.use((_, res) => {
  res.status(404).send({ error: "Recurso no encontrado", status: 404 });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Hubo un error en el servidor", status: 500 });
  next(err);
});

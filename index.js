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

// initializing a basic API that
// returns the "Hello, World!" message
app.get("/", (req, res) => {
  res.json("Holi, estoy vivo :)");
});

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

// Routes

app.post("/signin", login);
app.post("/signup", createUser);

app.use(auth);

// Rutas de usuario
app.use(
  "/",
  celebrate({
    body: {
      link: Joi.string().required().custom(validateURL),
    },
  }),
  userRouter
);

mongoose
  .connect("mongodb://localhost:27017/cicnos-database")
  .then(() => {
    console.log("Conexión exitosa a la base de datos");
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
  });

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log("Enlace al servidor");
});

app.use((_, res) => {
  res.status(404).send({ error: "Recurso no encontrado", status: 404 });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Hubo un error en el servidor", status: 500 });
  next(err);
});

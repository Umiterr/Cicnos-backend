const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const Product = require("./product");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Usuario",
    required: true,
    minlength: 3,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default:
      "https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fi.imgur.com%2FhU8yE56.jpg&sp=1709885203T4056af864d3b5a6c4ae14e602281752d613512e10a059aeb4ed42e885c1abb21",
    validate: {
      validator: function (v) {
        /^(https?:\/\/)?(www\.)?[a-zA-Z0-9._~:/?%#@\[\]!$&'()*+,;=]+(\/[a-zA-Z0-9._~:/?%#@\[\]!$&'()*+,;=]+)?(#.*)?$/i.test(
          v
        );
      },
      message: "El link de la imagen de perfil debe ser un enlace válido.",
    },
  },
  about: {
    type: String,
    default: "Descripcion",
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: "Correo electrónico no válido",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 100,
    select: false,
  },
  address: {
    city: String,
    street: String,
    number: Number,
    zipcode: String,
  },
  phone: String,
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.Number,
        ref: Product,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }

        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);

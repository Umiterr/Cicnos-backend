const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { NODE_ENV, JWT_SECRET } = process.env;

// Obtener lista de usuarios
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
        return res.status(404).send({ message: "No se encontraron usuarios" });
      }
      res.send({ data: users });
    })
    .catch(() =>
      res.status(500).send({ message: "Error al obtener los usuarios" })
    );
};

// Obtener usuario por ID
module.exports.getUser = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ error: `Este usuario no existe` });
        return;
      }

      res.send({ data: user });
    })
    .catch((error) => {
      console.error("Error en el controlador:", error);
      res.status(500).send({ error: "Error interno del servidor" });
    });
};

module.exports.getUserInfo = (req, res) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ error: `Este usuario no existe` });
        return;
      }

      res.send({ data: user });
    })
    .catch((error) => {
      console.error("Error en el controlador:", error);
      res.status(500).send({ error: "Error interno del servidor" });
    });
};

module.exports.createUser = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({
        message: "No se proporcionaron datos en el cuerpo de la solicitud.",
      });
    }

    const { name, about, avatar, email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
      cart: [],
    });

    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.send({ token });
  } catch (err) {
    // Manejar errores adecuadamente
    console.error(err);
    res.status(500).send({ message: "Error interno del servidor." });
  }
};

// Actualizar usuario
module.exports.updateUser = (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    _id,
    { name: name, about: about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) =>
      res.status(500).send({ message: "Error al actualizar usuario" })
    );
};

// Actualizar avatar de usuario
module.exports.updateAvatar = (req, res) => {
  const { _id } = req.user;
  const { newAvatar } = req.body;

  User.findByIdAndUpdate(
    _id,
    { avatar: newAvatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) =>
      res.status(500).send({ message: "Error al actualizar avatar" })
    );
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .send({ message: "Correo electrónico y contraseña son obligatorios." });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

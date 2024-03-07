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

// Crear usuario
module.exports.createUser = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "No se proporcionaron datos en el cuerpo de la solicitud.",
    });
  }

  const { name, about, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      return User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      });
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// Actualizar usuario
module.exports.updateUser = (req, res) => {
  const { _id } = req.user;
  const { newName } = req.body;

  User.findByIdAndUpdate(
    _id,
    { name: newName },
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

  // Validar que se proporcionó un correo electrónico y una contraseña
  if (!email || !password) {
    return res
      .status(400)
      .send({ message: "Correo electrónico y contraseña son obligatorios." });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      //      res.send({ status: true });

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      // error de autenticación
      res.status(401).send({ message: err.message });
    });
};

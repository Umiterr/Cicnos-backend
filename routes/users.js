const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getUserInfo,
} = require("../controllers/users");

router.get("/users", getUsers);

router.get("/users/me", getUserInfo);

router.get("/users/:id", getUser);

router.patch("/users/me", updateUser);

router.patch("/users/me/avatar", updateAvatar);

module.exports = router;

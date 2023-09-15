const router = require("express").Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUserById,
  getUsers,
  getUserProfile,
  editUserData,
  editUserAvatar,
} = require("../controllers/users");

router.get("/", getUsers);

router.get("/:userId", celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserById);

router.get("/me", getUserProfile);

router.patch("/me", celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), editUserData);

router.patch("/me/avatar", celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=,%]+#?$/),
  }),
}), editUserAvatar);

module.exports = router;

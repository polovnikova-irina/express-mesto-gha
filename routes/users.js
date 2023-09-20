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
router.get("/me", getUserProfile);

router.get("/:userId", celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().required(),
  }),
}), getUserById);

router.patch("/me", celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), editUserData);

router.patch("/me/avatar", celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri(),
  }),
}), editUserAvatar);

module.exports = router;

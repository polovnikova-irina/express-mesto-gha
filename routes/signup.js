const router = require("express").Router();
const { celebrate, Joi } = require('celebrate');
const { createUser } = require('../controllers/users');

router.post("/", celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().default("https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png").regex(/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=,%]+#?$/).message("Поле должно содержать корректную ссылку"),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
  }).unknown(true),
}), createUser);

module.exports = router;

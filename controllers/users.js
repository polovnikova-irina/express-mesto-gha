const User = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() =>
      res.status(500).send({ message: "На сервере произошла ошибка" })
    );
};

module.exports.getUserById = (req, res) => {
  const userId = req.params.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).send({
      message: "Переданы некорректные данные при создании пользователя",
    });
  }

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: "Пользователь по указанному _id не найден" });
      }
      res.status(200).send(user);
    })
    .catch(() =>
      res
        .status(404)
        .send({ message: "Пользователь по указанному _id не найден" })
    );
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email } = req.body;
  bcrypt
    .hash(req.body.password, 10) // хешируем пароль
    .then((hash) =>
      User.create({
        name, about, avatar, email, password: hash,
      })
    )
    .then((user) => res.status(201).send({
      name: user.name, about: user.about, avatar: user.avatar, _id: user._id, email: user.email
    }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ error: 'На сервере произошла ошибка', message: err.message });
      }
    });
};

module.exports.editUserData = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  if (userId) {
    User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true }
    )
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === "ValidationError") {
          res.status(400).send({ message: err.message });
        } else {
          res
            .status(404)
            .send({ message: "Пользователь с указанным _id не найден" });
        }
      });
  } else {
    res.status(500).send({ message: "На сервере произошла ошибка" });
  }
};

module.exports.editUserAvatar = (req, res) => {
  const userId = req.user._id;
  if (userId) {
    User.findByIdAndUpdate(
      userId,
      { avatar: req.body.avatar },
      { new: true, runValidators: true }
    )
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === "ValidationError") {
          res.status(400).send({ message: err.message });
        } else {
          res
            .status(404)
            .send({ message: "Запрашиваемый пользователь не найден" });
        }
      });
  } else {
    res.status(500).send({ message: "На сервере произошла ошибка" });
  }
};


module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
  .then((user) => {
    const token = jwt.sign({ _id: user._id }, 'mesto-key', { expiresIn: '7d' });
     res
     .cookie('token', token, {
      httpOnly: true,
      sameSite: true
     })
    .send(token)
   })
    .catch((err) => {
      res
      .status(401)
      .send({ message: err.message });
    });
};

module.exports.getUserProfile = (req, res) => {
  User.findById(req.user._id)
  .then((user) => res.status(200).send(user))
  .catch((err) => {
    res
    .status(401)
    .send({ message: err.message });
  });
};
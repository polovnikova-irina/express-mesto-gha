const User = require("../models/user");
const mongoose = require('mongoose');

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
        res.send(user);
      })
      .catch(() =>
        res
          .status(404)
          .send({ message: "Пользователь по указанному _id не найден" })
      );
};

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: "На сервере произошла ошибка" });
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

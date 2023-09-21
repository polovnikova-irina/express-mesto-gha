const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const BadRequestError = require("../errors/BadRequuestError");
const NotFoundError = require("../errors/NotFoundError");
const ConflictError = require("../errors/ConflictError");
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() =>
      res.status(500).send({ message: "На сервере произошла ошибка" })
    );
};

module.exports.getUserById = (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId)
  .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Указан некорректный _id "))
      } else if (err.name === "DocumentNotFoundError") {
      next(new NotFoundError("Пользователь по указанному _id не найден"))
      } else {
        next(err);
      }
})
};

module.exports.createUser = (req, res, next) => {
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
        next(new BadRequestError(err.message));
      } else if (err.code === 11000) {
        next(new ConflictError("Пользователь с таким email уже существует"));
      } else {
        next(err);
      }
    });
};

module.exports.editUserData = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;
    User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true }
    )
    .orFail()
      .then((user) => res.status(200).send(user))
      .catch((err) => {
        if (err.name === "ValidationError") {
          next(new BadRequestError(err.message));
        } else if (err.name === "DocumentNotFoundError") {
          next(new NotFoundError("Пользователь по указанному _id не найден"));
        } else {
          console.error('Error while updating user data:', err);
          next(err);
        }
      });
};


module.exports.editUserAvatar = (req, res, next) => {
  const userId = req.user._id;
    User.findByIdAndUpdate(
      userId,
      { avatar: req.body.avatar },
      { new: true, runValidators: true }
    )
    .orFail()
      .then((user) => res.status(200).send(user))
      .catch((err) => {
        if (err.name === "ValidationError") {
          next(new BadRequestError(err.message));
        } else if (err.name === "DocumentNotFoundError") {
          next(new NotFoundError("Пользователь по указанному _id не найден"));
        } else {
          next(err);
        }
      });
    };

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
  .then((user) => {
    const token = jwt.sign({ _id: user._id },  NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
     res
     .cookie('token', token, {
      httpOnly: true,
      sameSite: true
     })
    .send({ token })
   })
    .catch(next);
};

module.exports.getUserProfile = (req, res, next) => {
  User.findById(req.user._id)
  .then((user) => res.status(200).send(user))
  .catch(next);
};
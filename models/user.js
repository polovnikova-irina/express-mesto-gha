const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const { isURL } = require('validator');
const UnauthorizedError = require("../errors/UnauthorizedError");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'минимальная длина поля - 2'],
      maxlength: [30, 'максимальная длина поля - 30'],
      default: "Жак-Ив Кусто",
    },
    about: {
      type: String,
      minlength: [2, 'минимальная длина поля - 2'],
      maxlength: [30, 'максимальная длина поля - 30'],
      default: "Исследователь",
    },
    avatar: {
      type: String,
      default: "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
      validate: {
        validator: (v) => isURL(v),
        message: "Поле должно содержать корректную ссылку",
      },
    },
    email: {
      type: String,
      required: [true, 'Поле должно быть заполнено'],
      unique: [true, 'Поле должно быть уникальным'],
      validate: {
        validator: (v) => isEmail(v),
        message: 'Введите верный email',
      },
    },
    password: {
      type: String,
      required: [true, 'Поле должно быть заполнено'],
      minlength: 5,
      select: false,
    }
  },
  { versionKey: false }
);

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }

      // сравниваем переданный пароль и хеш из базы
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // хеши не совпали
            throw new UnauthorizedError('Неправильные почта или пароль');
          }

          return user;
        });
    });
};



module.exports = mongoose.model("user", userSchema);

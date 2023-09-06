const mongoose = require("mongoose");
const validator = require("validator");

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Поле должно быть заполнено"],
      minlength: [2, "минимальная дляна поля - 2"],
      maxlength: [30, "минимальная дляна поля - 30"],
    },
    link: {
      type: String,
      required: [true, "Поле должно быть заполнено"],
      validate: {
        validator: validator.isURL,
        message: "Поле должно содержать корректную ссылку",
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Поле должно быть заполнено"],
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: [],
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("card", cardSchema);

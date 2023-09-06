const Card = require("../models/card");
const mongoose = require('mongoose');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(["owner", "likes"])
    .then((cards) => res.send(cards))
    .catch(() =>
      res.status(500).send({ message: "На сервере произошла ошибка" })
    );
};

module.exports.addCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;

    const card = await Card.create({ name, link, owner });
    const populatedCard = await Card.findById(card._id).populate("owner");

    if (!populatedCard) {
      return res
        .status(404)
        .send({ message: "Карточка с указанным _id не найдена" });
    }
    res.send(populatedCard);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).send({ message: error.message });
    } else {
      res.status(500).send({ message: "На сервере произошла ошибка" });
    }
  }
};

module.exports.deleteCard = (req, res) => {
  const cardId = req.params.cardId;

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return res.status(400).send({
      message: "Переданы некорректные данные при создании пользователя",
    });
  }

    Card.findByIdAndRemove(cardId)
      .then((card) => {
        if (!card) {
          return res
            .status(404)
            .send({ message: "Карточка с указанным _id не найдена" });
        }
        res.send({ message: "Карточка удалена" });
      })
      .catch(() =>
        res.status(500).send({ message: "На сервере произошла ошибка" })
      );
};

module.exports.likeCard = (req, res) => {
  const cardId = req.params.cardId;

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return res.status(400).send({
      message: "Карточка с указанным _id не найдена",
    });
  }

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .populate(["owner", "likes"])
    .then((card) => {
      if (!card) {
        return res
          .status(404)
          .send({ message: "Карточка с указанным _id не найдена" });
      }
      res.send(card);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "На сервере произошла ошибка" });
    });
};

module.exports.dislikeCard = (req, res) => {
   const cardId = req.params.cardId;

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return res.status(400).send({
      message: "Карточка с указанным _id не найдена",
    });
  }

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .populate(["owner", "likes"])
    .then((card) => {
      if (!card) {
        return res
          .status(404)
          .send({ message: "Карточка с указанным _id не найдена" });
      }
      res.send(card);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "На сервере произошла ошибка" });
    });
};


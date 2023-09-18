const Card = require("../models/card");
const httpConstants = require('http');
const BadRequestError = require("../errors/BadRequuestError");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(["owner", "likes"])
    .then((cards) => res.status(httpConstants.HTTP_STATUS_OK).send(cards))
    .catch(next)
};

module.exports.addCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
  .orFail()
    .then((card) => {
      res.status(httpConstants.HTTP_STATUS_CREATED).send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Некорректный _id карточик"));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const cardId = req.params.cardId;
  Card.findById(cardId)
  .orFail()
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError("Карточка другого пользователя")
      }
      return Card.findByIdAndRemove(cardId);
    })
    .then(() => {
      res.status(httpConstants.HTTP_STATUS_OK).send({ message: "Карточка удалена" });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Указан некорректный _id карточки"))
      } else if (err.name === "DocumentNotFoundError") {
      next(new NotFoundError("Катрточка по указанному _id не найден"))
      } else {
        next(err);
      }
})
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
  .orFail()
    .populate(["owner", "likes"])
    .then((card) => {
      res.status(httpConstants.HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Указан некорректный _id карточки"))
      } else if (err.name === "DocumentNotFoundError") {
      next(new NotFoundError("Пользователь по указанному _id не найден"))
      } else {
        next(err);
      }
})
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
  .orFail()
    .populate(["owner", "likes"])
    .then((card) => {
      res.status(httpConstants.HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Указан некорректный _id карточки"))
      } else if (err.name === "DocumentNotFoundError") {
      next(new NotFoundError("Пользователь по указанному _id не найден"))
      } else {
        next(err);
      }
    })
};

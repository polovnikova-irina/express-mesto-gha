const jwt = require('jsonwebtoken');
const UnauthorizedError = require("../errors/UnauthorizedError");
const { NODE_ENV, JWT_SECRET } = process.env;

const extractBearerToken = (header) => {
  return header.replace('Bearer ', '')
};

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
   throw new UnauthorizedError('Неправильные почта или пароль');
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new UnauthorizedError('Неправильные почта или пароль');
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};


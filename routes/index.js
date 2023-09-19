const router = require("express").Router();
const usersRoute = require("./users");
const cardsRouter = require("./cards");
const signupRouter = require("./signup");
const signinRouter = require("./signin");
const auth = require('../middlewares/auth');
const NotFoundError = require("../errors/NotFoundError");

router.use('/signin', signinRouter);
router.use('/signup', signupRouter);

router.use(auth);
router.use("/users", usersRoute);
router.use("/cards", cardsRouter);

router.use("*", (req, res, next) => {
  next(new NotFoundError("Страница не найдена"))
});

module.exports = router;
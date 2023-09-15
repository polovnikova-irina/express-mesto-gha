const router = require("express").Router();
const usersRoute = require("./users");
const cardsRouter = require("./cards");
const signupRouter = require("./signup");
const signinRouter = require("./signin");
const auth = require('../middlewares/auth');

router.use('/signup', signupRouter);
router.use('/signin', signinRouter);

router.use(auth);
router.use("/users", usersRoute);
router.use("/cards", cardsRouter);

module.exports = router;
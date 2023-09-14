const router = require("express").Router();
const usersRoute = require("./users");
const cardsRouter = require("./cards");
const signupRouter = require("./signup");
const signinRouter = require("./signin");

router.post('/signin', signinRouter);
router.post('/signup', signupRouter);

router.use("/users", usersRoute);
router.use("/cards", cardsRouter);

module.exports = router;
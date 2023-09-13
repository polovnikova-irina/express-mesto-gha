const router = require("express").Router();
const {
  getUserById,
  getUsers,
  editUserData,
  editUserAvatar,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", getUserById);
router.patch("/me", editUserData);
router.patch("/me/avatar", editUserAvatar);

module.exports = router;

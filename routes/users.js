const router = require("express").Router();
const {
  getUserById,
  addUser,
  getUsers,
  editUserData,
  editUserAvatar,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", getUserById);
router.post("/", addUser);
router.patch("/me", editUserData);
router.patch("/me/avatar", editUserAvatar);

module.exports = router;

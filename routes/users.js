const router = require('express').Router();
const { getUserId, createUser, getUsers} = require('../controllers/users');

router.get('/:userId', getUserId);

router.get('/', getUsers);

router.post('/', createUser);

module.exports = router;
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const upload = require('../config/spaces');
const { login, getAllUsers, getUserById, updateUser, logout } = require('../controllers/user');

router.post('/login', login);
router.get('/users', auth, getAllUsers);
router.get('/users/details/:id', auth, getUserById);
router.put('/users/block/:id', auth, updateUser);
router.post('/logout', auth, logout);
router.post('/register', auth, upload.single('image'));

module.exports = router;
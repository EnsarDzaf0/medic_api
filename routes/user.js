const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const upload = require('../config/spaces');
const { login, getAllUsers, getUserById, updateUser, logout, register } = require('../controllers/user');

router.post('/login', login);
router.get('/users', auth, admin, getAllUsers);
router.get('/users/details/:id', auth, admin, getUserById);
router.put('/users/block/:id', auth, admin, updateUser);
router.post('/logout', auth, admin, logout);
router.post('/register', auth, admin, upload.single('image'), register);

router.get('/protected', auth, (req, res) => {
    return res.status(200).json({ message: 'You are authorized' });
});

module.exports = router;
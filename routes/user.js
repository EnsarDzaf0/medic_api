const express = require('express');
const router = express.Router();
const { login } = require('../controllers/user');

router.post('/login', login);
router.get('/users');
router.get('/users/details/:id');
router.post('/users/block/:id');
router.post('logout');
router.post('/register');

module.exports = router;
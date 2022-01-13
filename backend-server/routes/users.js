const express = require('express');
const { getAllUsers } = require('../controllers/userController');
const { verifyToken } = require('../controllers/authController');

const router = express.Router();

//Get list of all users
router.get('/all', verifyToken, getAllUsers);

module.exports = router;
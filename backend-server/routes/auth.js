const express = require('express');
const {createUser} = require('../controllers/authController');

const router = express.Router();

//POST - Create a new user
router.post('/create', createUser);

module.exports = router;
const express = require('express');
const { getUsers, createUser, updateUsers } = require('../controllers/userController');
const { body } = require('express-validator');

const router = express.Router();

router.get('/', getUsers);

router.post('/',[body('email').isEmail().normalizeEmail(), body('password').isLength({min:8}), body('userType').notEmpty()],createUser);

router.patch('/:email',updateUsers);




module.exports = router;

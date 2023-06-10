const express = require('express');
const router = express.Router();
const {
	loginUser,
	signupUser,
	getAllUsers,
	deleteOneUser,
	getAdmins,
	getOneUser,
} = require('../controllers/usercontroller');
const { isAdmin } = require('../middleware/auth');

router.post('/login', loginUser);

router.post('/signup', signupUser);

router.get('/allusers', isAdmin, getAllUsers);

router.get('/allusers/:id', isAdmin, getOneUser);

router.delete('/deleteuser/:id', isAdmin, deleteOneUser);

router.get('/adminUsers', isAdmin, getAdmins);

module.exports = router;

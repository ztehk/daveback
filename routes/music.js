const express = require('express');
const router = express.Router();

const {
	getAllMusic,
	getOneMusic,
	postSingleMusic,
	patchOneMusic,
	deleteOneMusic,
	addComent,
} = require('../controllers/musiccontroller');

const { auth: isAuthenticated, isAdmin } = require('../middleware/auth');

router.get('/', getAllMusic);
router.get('/:title', getOneMusic);
router.post('/create', isAdmin, postSingleMusic);
router.patch('/update/:id', isAdmin, patchOneMusic);
router.delete('/delete/:id', isAdmin, deleteOneMusic);
router.post('/comment/post/:id', isAuthenticated, addComent);

module.exports = router;

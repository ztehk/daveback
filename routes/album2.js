const express = require('express');
const router = express.Router();

const {
	postSingleMusic,
	getAllMusic,
	getOneMusic,
} = require('../controllers/album2cont');

const { auth: isAuthenticated, isAdmin } = require('../middleware/auth');

router.get('/', getAllMusic);
router.get('/:title', getOneMusic);
router.post('/create', isAdmin, postSingleMusic);
// router.patch('/update/:id', isAdmin, patchOneVideo);
// router.delete('/delete/:id', isAdmin, deleteOneVideo);
// router.post('/comment/post/:id', isAuthenticated, addComent);

module.exports = router;

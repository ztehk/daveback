const express = require('express');
const router = express.Router();

const {
	getAllVideo,
	getOneVideo,
	postSingleVideo,
	patchOneVideo,
	deleteOneVideo,
	addComent,
} = require('../controllers/videocontroller');

const { auth: isAuthenticated, isAdmin } = require('../middleware/auth');

router.get('/', getAllVideo);
router.get('/:title', getOneVideo);
router.post('/create', isAdmin, postSingleVideo);
router.patch('/update/:id', isAdmin, patchOneVideo);
router.delete('/delete/:id', isAdmin, deleteOneVideo);
router.post('/comment/post/:id', isAuthenticated, addComent);

module.exports = router;

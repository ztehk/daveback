const express = require('express');
const router = express.Router();

const {
	getAllPost,
	getOnePost,
	patchOnePost,
	deleteOnePost,
	postSinglePost,
	addComent,
	addLikes,
} = require('../controllers/postcontroller');

const { auth: isAuthenticated, isAdmin } = require('../middleware/auth');

router.get('/', getAllPost);
router.get('/:title', getOnePost);
router.post('/create', isAdmin, postSinglePost);
router.patch('/update/:id', isAdmin, patchOnePost);
router.delete('/delete/:id', isAdmin, deleteOnePost);
router.post('/comment/post/:id', isAuthenticated, addComent);
router.post('/like/post/:id', isAuthenticated, addLikes);

module.exports = router;

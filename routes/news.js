const express = require('express');
const router = express.Router();

const {
	postSinglenews,
	getAllNews,
	getOneNews,
	deleteOneNews,
	addComent,
} = require('../controllers/newscontroller');

const { auth: isAuthenticated, isAdmin } = require('../middleware/auth');

router.get('/', getAllNews);
router.get('/:title', getOneNews);
router.post('/create', isAdmin, postSinglenews);
// router.patch('/update/:id', isAdmin, patchOneLyrics);
router.delete('/delete/:id', isAdmin, deleteOneNews);
router.post('/comment/post/:id', isAuthenticated, addComent);
module.exports = router;

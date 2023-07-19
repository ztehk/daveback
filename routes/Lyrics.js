const express = require('express');
const router = express.Router();

const {
	getAllLyrics,
	getOneLyrics,
	postSingleLyrics,
	patchOneLyrics,
	deleteOneLyrics,
	addComent,
} = require('../controllers/lyricscontroller');

const { auth: isAuthenticated, isAdmin } = require('../middleware/auth');

router.get('/', getAllLyrics);
router.get('/:title', getOneLyrics);
router.post('/create', isAdmin, postSingleLyrics);
router.patch('/update/:id', isAdmin, patchOneLyrics);
router.delete('/delete/:id', isAdmin, deleteOneLyrics);
router.post('/comment/post/:id', isAuthenticated, addComent);

module.exports = router;

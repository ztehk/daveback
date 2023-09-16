const express = require('express');
const router = express.Router();

const {
	postSingleSport,
	getAllSport,
	getOneSport,
	deleteOneSport,
	addComent,
} = require('../controllers/sportcontroller');

const { auth: isAuthenticated, isAdmin } = require('../middleware/auth');

router.get('/', getAllSport);
router.get('/:title', getOneSport);
router.post('/create', isAdmin, postSingleSport);
// router.patch('/update/:id', isAdmin, patchOneLyrics);
router.delete('/delete/:id', isAdmin, deleteOneSport);
router.post('/comment/post/:id', isAuthenticated, addComent);
module.exports = router;

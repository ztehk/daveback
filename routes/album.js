const express = require('express');
const router = express.Router();

const {
	getAllAlbum,
	getOneAlbum,
	postSingleAlbum,
	patchOneAlbum,
	deleteOneAlbum,
	addComent,
} = require('../controllers/albumcontroller');

const { auth: isAuthenticated, isAdmin } = require('../middleware/auth');

router.get('/', getAllAlbum);
router.get('/:title', getOneAlbum);
router.post('/create', isAdmin, postSingleAlbum);
router.patch('/update/:id', isAdmin, patchOneAlbum);
router.delete('/delete/:id', isAdmin, deleteOneAlbum);
router.post('/comment/post/:id', isAuthenticated, addComent);

module.exports = router;

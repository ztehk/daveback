const express = require('express');
const router = express.Router();

const { postSinglenews } = require('../controllers/newscontroller');

const { auth: isAuthenticated, isAdmin } = require('../middleware/auth');

// router.get('/', getAllVideo);
// router.get('/:title', getOneVideo);
router.post('/create', isAdmin, postSinglenews);
// router.patch('/update/:id', isAdmin, patchOneVideo);
// router.delete('/delete/:id', isAdmin, deleteOneVideo);
// router.post('/comment/post/:id', isAuthenticated, addComent);

module.exports = router;

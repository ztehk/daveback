const express = require("express");
const router = express.Router();

const {
  postOneTech,
  getAllTech,
  getOneTech,
} = require("../controllers/techcont");

const { auth: isAuthenticated, isAdmin } = require("../middleware/auth");

router.get("/", getAllTech);
router.get("/:title", getOneTech);
router.post("/create", isAdmin, postOneTech);
// router.patch('/update/:id', isAdmin, patchOneVideo);
// router.delete('/delete/:id', isAdmin, deleteOneVideo);
// router.post('/comment/post/:id', isAuthenticated, addComent);

module.exports = router;

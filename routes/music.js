const express = require("express");
const router = express.Router();

const {
  getAllMusic,
  getOneMusic,
  postoneMusic,
  patchonemusic,
  deleteMusic,
  addComent,
} = require("../controllers/musiccont");

const { auth: isAuthenticated, isAdmin } = require("../middleware/auth");

router.get("/", getAllMusic);
router.get("/:title", getOneMusic);
router.post("/create", isAdmin, postoneMusic);
router.patch("/update/:id", isAdmin, patchonemusic);
router.delete("/delete/:id", isAdmin, deleteMusic);
router.post("/comment/post/:id", isAuthenticated, addComent);

module.exports = router;

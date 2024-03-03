const express = require("express");
const router = express.Router();

const {
  getAllGist,
  getOneGist,
  postoneGist,
  // patchoneGist,
  deleteGist,
  addComent,
} = require("../controllers/gistcont");

const { auth: isAuthenticated, isAdmin } = require("../middleware/auth");

router.get("/", getAllGist);
router.get("/:title", getOneGist);
router.post("/create", isAdmin, postoneGist);
// router.patch("/update/:id", isAdmin, patchoneGist);
router.delete("/delete/:id", isAdmin, deleteGist);
router.post("/comment/post/:id", isAuthenticated, addComent);

module.exports = router;

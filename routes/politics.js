const express = require("express");
const router = express.Router();

const {
  getAllPolitics,
  getOnePolitics,
  postonePolitics,
  // patchonePolitics,
  deletePolitics,
  addComent,
} = require("../controllers/politicscont");

const { auth: isAuthenticated, isAdmin } = require("../middleware/auth");

router.get("/", getAllPolitics);
router.get("/:title", getOnePolitics);
router.post("/create", isAdmin, postonePolitics);
// router.patch("/update/:id", isAdmin, patchonePolitics);
router.delete("/delete/:id", isAdmin, deletePolitics);
router.post("/comment/post/:id", isAuthenticated, addComent);

module.exports = router;

const express = require("express");
const router = express.Router();

const {
  postoneCeleb,
  getAllCeleb,
  getOneCeleb,
  deleteCeleb,
  patchoneceleb,
  addComent,
} = require("../controllers/celebritycont");

const { auth: isAuthenticated, isAdmin } = require("../middleware/auth");

router.get("/", getAllCeleb);
router.get("/:title", getOneCeleb);
router.post("/create", isAdmin, postoneCeleb);
router.patch("/update/:id", isAdmin, patchoneceleb);
router.delete("/delete/:id", isAdmin, deleteCeleb);
router.post("/comment/post/:id", isAuthenticated, addComent);
module.exports = router;

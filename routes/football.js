const express = require("express");
const router = express.Router();

const {
  getAllFootball,
  getOneFootball,
  postoneFootball,

  deleteFootball,
  addComent,
} = require("../controllers/footballcont");

const { auth: isAuthenticated, isAdmin } = require("../middleware/auth");

router.get("/", getAllFootball);
router.get("/:title", getOneFootball);
router.post("/create", isAdmin, postoneFootball);
// router.patch("/update/:id", isAdmin, patchoneFootball);
router.delete("/delete/:id", isAdmin, deleteFootball);
router.post("/comment/post/:id", isAuthenticated, addComent);

module.exports = router;

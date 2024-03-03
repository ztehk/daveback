const express = require("express");
const router = express.Router();

const {
  getAllBox,
  getOneBox,
  postoneBox,
  patchoneBox,
  deleteBox,
  addComent,
} = require("../controllers/boxingcont");

const { auth: isAuthenticated, isAdmin } = require("../middleware/auth");

router.get("/", getAllBox);
router.get("/:title", getOneBox);
router.post("/create", isAdmin, postoneBox);
router.patch("/update/:id", isAdmin, patchoneBox);
router.delete("/delete/:id", isAdmin, deleteBox);
router.post("/comment/post/:id", isAuthenticated, addComent);

module.exports = router;

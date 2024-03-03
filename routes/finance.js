const express = require("express");
const router = express.Router();

const {
  getAllFinance,
  getOneFinance,
  postoneFinance,
  deleteFinance,
  addComent,
} = require("../controllers/financecont");

const { auth: isAuthenticated, isAdmin } = require("../middleware/auth");

router.get("/", getAllFinance);
router.get("/:title", getOneFinance);
router.post("/create", isAdmin, postoneFinance);
// router.patch('/update/:id', isAdmin, patchOneVideo);
router.delete("/delete/:id", isAdmin, deleteFinance);
router.post("/comment/post/:id", isAuthenticated, addComent);

module.exports = router;

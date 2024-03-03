const express = require("express");
const router = express.Router();

const {
  getAllForex,
  getOneForex,
  postoneForex,
  deleteForex,
  addComent,
} = require("../controllers/forexcont");

const { auth: isAuthenticated, isAdmin } = require("../middleware/auth");

router.get("/", getAllForex);
router.get("/:title", getOneForex);
router.post("/create", isAdmin, postoneForex);
router.delete("/delete/:id", isAdmin, deleteForex);
router.post("/comment/post/:id", isAuthenticated, addComent);

module.exports = router;

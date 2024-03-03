const express = require("express");
const router = express.Router();

const {
  getAllTen,
  getOneTen,
  postoneTen,
  // patchoneTen,
  deleteTen,
  addComent,
} = require("../controllers/tencont");

const { auth: isAuthenticated, isAdmin } = require("../middleware/auth");

router.get("/", getAllTen);
router.get("/:title", getOneTen);
router.post("/create", isAdmin, postoneTen);
// router.patch("/update/:id", isAdmin, patchoneTen);
router.delete("/delete/:id", isAdmin, deleteTen);
router.post("/comment/post/:id", isAuthenticated, addComent);

module.exports = router;

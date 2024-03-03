const express = require("express");
const router = express.Router();

const {
  getAllTennis,
  getOneTennis,
  postoneTennis,
  // patchoneTennis,
  deleteTennis,
  addComent,
} = require("../controllers/tenniscont");

const { auth: isAuthenticated, isAdmin } = require("../middleware/auth");

router.get("/", getAllTennis);
router.get("/:title", getOneTennis);
router.post("/create", isAdmin, postoneTennis);
// router.patch("/update/:id", isAdmin, patchoneTennis);
router.delete("/delete/:id", isAdmin, deleteTennis);
router.post("/comment/post/:id", isAuthenticated, addComent);

module.exports = router;

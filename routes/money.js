const express = require("express");
const router = express.Router();

const {
  getAllMoney,
  getOneMoney,
  postoneMoney,
  // patchoneMoney,
  deleteMoney,
  addComent,
} = require("../controllers/moneycont");

const { auth: isAuthenticated, isAdmin } = require("../middleware/auth");

router.get("/", getAllMoney);
router.get("/:title", getOneMoney);
router.post("/create", isAdmin, postoneMoney);
// router.patch("/update/:id", isAdmin, patchoneMoney);
router.delete("/delete/:id", isAdmin, deleteMoney);
router.post("/comment/post/:id", isAuthenticated, addComent);

module.exports = router;

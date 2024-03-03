const express = require("express");
const router = express.Router();

const {
  getAllAthletics,
  getOneAthletics,
  postSingleAthletics,
  patchoneathletics,
  deleteOneathletics,
  addComent,
} = require("../controllers/athleticscont");

const { auth: isAuthenticated, isAdmin } = require("../middleware/auth");

router.get("/", getAllAthletics);
router.get("/:title", getOneAthletics);
router.post("/create", isAdmin, postSingleAthletics);
router.patch("/update/:id", isAdmin, patchoneathletics);
router.delete("/delete/:id", isAdmin, deleteOneathletics);
router.post("/comment/post/:id", isAuthenticated, addComent);

module.exports = router;

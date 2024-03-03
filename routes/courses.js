const express = require("express");
const router = express.Router();

const {
  postoneCourses,
  getAllCourses,
  getOneCourses,
  deleteCourses,
  addComent,
} = require("../controllers/coursecont");

const { auth: isAuthenticated, isAdmin } = require("../middleware/auth");

router.get("/", getAllCourses);
router.get("/:title", getOneCourses);
router.post("/create", isAdmin, postoneCourses);
// router.patch('/update/:id', isAdmin, patchOneLyrics);
router.delete("/delete/:id", isAdmin, deleteCourses);
router.post("/comment/post/:id", isAuthenticated, addComent);
module.exports = router;

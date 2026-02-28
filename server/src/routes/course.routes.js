import express from "express";
import multer from "multer";
import {
  createCourse,
  getAllCourses,
  getCourseById
} from "../controllers/course.controller.js";

const router = express.Router();

const upload = multer();

router.post("/", upload.single("pdf"), createCourse);
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

export default router;
import Course from "../models/Course.js";
import { extractTextFromPDF } from "../services/pdfParser.service.js";
import { generateFullCourse } from "../services/aiGenerator.service.js";

export const createCourse = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "PDF file required" });
    }

    const text = await extractTextFromPDF(req.file.buffer);

    const courseData = await generateFullCourse(text);

    const savedCourse = await Course.create(courseData);

    res.status(201).json(savedCourse);
  } catch (error) {
    next(error);
  }
};

export const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses || []);
  } catch (error) {
    next(error);
  }
};


export const getCourseById = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });
  res.json(course);
};
import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: String,
  content: String,
  examples: String,
  code: String,
  quiz: [
    {
      question: String,
      options: [String],
      answer: String
    }
  ],
  assignment: String,
  interviewQuestions: [String]
});

const moduleSchema = new mongoose.Schema({
  title: String,
  description: String,
  lessons: [lessonSchema]
});

const courseSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    level: String,
    duration: String,
    modules: [moduleSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
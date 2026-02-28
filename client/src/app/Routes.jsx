import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import CourseLayout from "../layout/CourseLayout";

import Home from "../pages/Home";
import Courses from "../pages/Courses";
import CreateCourse from "../pages/CreateCourse";
import CourseDashboard from '../pages/CourseDashboard';
import CourseDetails from "../pages/CourseDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "courses", element: <Courses /> },
      { path: "create", element: <CreateCourse /> }
    ]
  },
  {
    path: "/course/:id",
    element: <CourseLayout />,
    children: [
      { index: true, element: <CourseDashboard /> }, // Dashboard is the default view
      { path: "learn", element: <CourseDetails /> }  // Learning mode
    ]
  }
]);
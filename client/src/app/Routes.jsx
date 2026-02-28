import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "../layout/MainLayout";
import CourseLayout from "../layout/CourseLayout";

// Lazy load pages for performance
const Home = lazy(() => import("../pages/Home"));
const Courses = lazy(() => import("../pages/Courses"));
const CreateCourse = lazy(() => import("../pages/CreateCourse"));
const CourseDashboard = lazy(() => import("../pages/CourseDashboard"));
const CourseDetails = lazy(() => import("../pages/CourseDetails"));

// Loading fallback component
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Suspense fallback={<PageLoader />}><Home /></Suspense> },
      { path: "courses", element: <Suspense fallback={<PageLoader />}><Courses /></Suspense> },
      { path: "create", element: <Suspense fallback={<PageLoader />}><CreateCourse /></Suspense> }
    ]
  },
  {
    path: "/course/:id",
    element: <CourseLayout />,
    children: [
      { index: true, element: <Suspense fallback={<PageLoader />}><CourseDashboard /></Suspense> },
      { path: "learn", element: <Suspense fallback={<PageLoader />}><CourseDetails /></Suspense> }
    ]
  }
]);

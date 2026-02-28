import { useState, useEffect } from 'react';
import { Outlet, useParams, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Settings, ChevronLeft } from 'lucide-react';
import { courseService } from '../services/course.service';
import Loading from '../components/Loading';
import ZaraAI from '../components/ZaraAI';

export default function CourseLayout() {
  const { id } = useParams();
  const location = useLocation();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await courseService.getCourseById(id);
        setCourse(data);
      } catch (err) {
        setError('Failed to load course data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loading /></div>;

  if (error || !course) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <p className="text-red-500 font-medium mb-4">{error || 'Course not found'}</p>
        <Link to="/courses" className="text-emerald-500 hover:text-emerald-600 font-medium inline-flex items-center">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Courses
        </Link>
      </div>
    );
  }

  const isLearningView = location.pathname.includes('/learn');

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">

      {/* Sidebar Navigation */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex shrink-0">
        <div className="h-20 flex items-center px-8 border-b border-slate-100">
          <Link to="/" className="text-xl font-bold tracking-tight text-slate-900">
            learnify<span className="text-emerald-500">.</span>
          </Link>
        </div>

        <div className="flex-1 py-6 px-4 space-y-2">
          <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Navigation</p>

          <Link
            to={`/course/${course._id || course.id}`}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-medium
              ${!isLearningView ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}
            `}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Overview</span>
          </Link>

          <Link
            to={`/course/${course._id || course.id}/learn`}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-medium
              ${isLearningView ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}
            `}
          >
            <BookOpen className="w-5 h-5" />
            <span>Learning</span>
          </Link>

          <div className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 mt-8 cursor-not-allowed">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top bar for mobile or breadcrumbs */}
        {!isLearningView && (
          <div className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center px-8 shrink-0 md:bg-transparent md:border-transparent md:backdrop-blur-none pointer-events-none">
            {/* Can place breadcrumbs or mobile menu trigger here */}
          </div>
        )}

        <div className={`flex-1 overflow-y-auto ${!isLearningView ? 'p-6 md:p-8' : ''}`}>
          <Outlet context={{ course }} />
        </div>
      </div>

      {/* Zara AI Floating Assistant */}
      <ZaraAI lessonContext={course ? { title: course.title, content: course.description } : null} />

    </div>
  );
}
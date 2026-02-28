import { useOutletContext, Link } from 'react-router-dom';
import { BookOpen, Target, Clock, Trophy } from 'lucide-react';
import AnalyticsCharts from '../components/AnalyticsCharts';
import useProgressStore from '../store/progressStore';

export default function CourseDashboard() {
    const { course } = useOutletContext(); // Passed down from CourseLayout
    const { completedLessons } = useProgressStore();

    if (!course) return null;

    const totalModules = course.modules?.length || 0;
    let totalLessons = 0;

    // Count total lessons across all modules
    course.modules?.forEach(m => totalLessons += (m.lessons?.length || 0));

    // Calculate how many lessons specifically in THIS course are completed
    let courseCompletedLessons = 0;
    course.modules?.forEach(m => {
        m.lessons?.forEach(l => {
            if (completedLessons.includes(l._id || l.id)) {
                courseCompletedLessons++;
            }
        });
    });

    const progressPercentage = totalLessons === 0 ? 0 : Math.round((courseCompletedLessons / totalLessons) * 100);

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">

            {/* Header Area */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10 -mr-10 -mt-20"></div>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-3xl">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight leading-tight">
                            {course.title}
                        </h1>
                        <p className="text-slate-500 text-lg leading-relaxed">
                            {course.description || "Welcome to your AI-generated course overview."}
                        </p>
                    </div>
                    <Link to={`/course/${course._id || course.id}/learn`}>
                        <button className="whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold shadow-md shadow-emerald-200 transition-all active:scale-95">
                            Start Learning
                        </button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <BookOpen className="w-8 h-8 text-emerald-500 mb-4" />
                    <p className="text-3xl font-bold text-slate-900">{totalModules}</p>
                    <p className="text-sm font-medium text-slate-500 mt-1">Total Modules</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <Target className="w-8 h-8 text-emerald-400 mb-4" />
                    <p className="text-3xl font-bold text-slate-900">{totalLessons}</p>
                    <p className="text-sm font-medium text-slate-500 mt-1">Total Lessons</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <Clock className="w-8 h-8 text-emerald-300 mb-4" />
                    <p className="text-3xl font-bold text-slate-900">20h</p>
                    <p className="text-sm font-medium text-slate-500 mt-1">Est. Duration</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <Trophy className={`w-8 h-8 mb-4 ${progressPercentage === 100 ? 'text-amber-400' : 'text-emerald-200'}`} />
                    <p className="text-3xl font-bold text-slate-900">{progressPercentage}%</p>
                    <p className="text-sm font-medium text-slate-500 mt-1">Overall Progress</p>
                </div>
            </div>

            {/* Charts */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Course Analytics</h2>
                <p className="text-slate-500">A detailed breakdown of your course content.</p>
                <AnalyticsCharts course={course} />
            </div>

        </div>
    );
}

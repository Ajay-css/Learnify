import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const COLORS = [
  'from-emerald-400 to-teal-500',
  'from-violet-400 to-indigo-500',
  'from-amber-400 to-orange-500',
  'from-sky-400 to-blue-500',
  'from-rose-400 to-pink-500',
  'from-green-400 to-emerald-600',
];

export default function CourseCard({ course, index = 0 }) {
  const moduleCount = course.modules?.length || 0;
  const lessonCount = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
  const gradient = COLORS[index % COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group cursor-pointer"
    >
      <Link to={`/course/${course._id}`} className="block h-full flex flex-col">
        {/* Gradient header */}
        <div className={`h-28 sm:h-32 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          {/* Level badge */}
          {course.level && (
            <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/30">
              {course.level}
            </span>
          )}
        </div>

        <div className="p-5 flex-1 flex flex-col gap-3">
          <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors">
            {course.title || 'Untitled Course'}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 flex-1 leading-relaxed">
            {course.description || 'Explore this AI-generated learning material.'}
          </p>

          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {moduleCount} Modules
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {lessonCount} Lessons
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
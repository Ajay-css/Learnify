import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useProgressStore from '../store/progressStore';

export default function ModuleSidebar({ course, selectedLesson, onSelectLesson }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const completedLessons = useProgressStore(state => state.completedLessons);
  const isLessonCompleted = (id) => completedLessons.includes(String(id || ''));

  if (!course || !course.modules) return null;

  const totalLessons = course.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
  const completedCount = course.modules.reduce((acc, m) =>
    acc + (m.lessons?.filter(l => isLessonCompleted(l._id || l.id))?.length || 0), 0);
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex-shrink-0">
        <h2 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2">
          {course.title || 'Course Content'}
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 font-medium">{course.modules.length} Modules · {totalLessons} Lessons</p>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-semibold text-slate-500">Progress</span>
            <span className="text-xs font-bold text-emerald-600">{progressPct}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Module List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {course.modules.map((module, mIndex) => (
          <div key={module._id || mIndex} className="rounded-xl overflow-hidden border border-slate-100 bg-white">
            {/* Module header */}
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Module {mIndex + 1}</span>
              <p className="text-xs font-semibold text-slate-700 mt-0.5 line-clamp-1">{module.title}</p>
            </div>
            {/* Lessons */}
            <div className="flex flex-col">
              {module.lessons?.map((lesson, lIndex) => {
                const isSelected = String(selectedLesson?._id || selectedLesson?.id) === String(lesson._id || lesson.id);
                const completed = isLessonCompleted(lesson._id || lesson.id);

                return (
                  <button
                    key={lesson._id || lIndex}
                    onClick={() => { onSelectLesson(lesson); setMobileOpen(false); }}
                    className={`text-left px-4 py-3 flex items-center gap-3 text-xs transition-all border-l-4 ${isSelected
                      ? 'bg-emerald-50 border-l-emerald-500 text-emerald-700'
                      : completed
                        ? 'border-l-emerald-200 text-slate-500 hover:bg-slate-50'
                        : 'border-l-transparent text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    <div className="flex-shrink-0">
                      {completed ? (
                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : isSelected ? (
                        <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                    </div>
                    <span className={`flex-1 font-medium line-clamp-2 leading-snug ${isSelected ? 'font-semibold' : ''}`}>
                      {lIndex + 1}. {lesson.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile: floating "Modules" toggle button */}
      <div className="md:hidden fixed bottom-24 left-4 z-40">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setMobileOpen(o => !o)}
          className="bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Modules
        </motion.button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 md:hidden shadow-2xl overflow-hidden"
            >
              {/* Close button */}
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-3 right-3 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center z-10"
              >
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-72 lg:w-80 border-r border-slate-200 bg-white h-[calc(100vh-4rem)] shrink-0 flex-col overflow-hidden">
        <SidebarContent />
      </div>
    </>
  );
}
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/courses', label: 'Courses' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0" onClick={() => setMobileOpen(false)}>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              learnify<span className="text-emerald-500">.</span>
            </span>
          </Link>

          {/* Desktop Center Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-sm font-medium transition-colors ${location.pathname === to
                    ? 'text-emerald-500'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop Right CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/courses">
              <span className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors px-2 py-1">
                Browse Courses
              </span>
            </Link>
            <Link to="/create">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Create Course
              </motion.button>
            </Link>
          </div>

          {/* Mobile: CTA pill + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link to="/create" onClick={() => setMobileOpen(false)}>
              <span className="text-xs font-semibold text-white bg-emerald-500 px-3 py-1.5 rounded-full">
                + Create
              </span>
            </Link>
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-white border-t border-slate-100 shadow-lg"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${location.pathname === to
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  {label}
                </Link>
              ))}
              <Link to="/courses" onClick={() => setMobileOpen(false)}>
                <span className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Browse Courses
                </span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
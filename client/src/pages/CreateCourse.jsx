import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UploadCloud, File, X, Loader2 } from 'lucide-react';
import { courseService } from '../services/course.service';

export default function CreateCourse() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setError(null);
    } else {
      setError('Please select a valid PDF file.');
      setFile(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === 'application/pdf') {
      setFile(dropped);
      setError(null);
    } else {
      setError('Please drop a valid PDF file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const newCourse = await courseService.createCourse(formData);
      navigate(`/course/${newCourse._id || newCourse.id}`);
    } catch (err) {
      console.error('Course creation error:', err);
      setError(err.response?.data?.message || 'Failed to generate course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Generate New Course</h1>
        <p className="text-slate-500 mt-2 text-lg">Upload any PDF document and let AI build a structured course.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-start">
            <X className="w-5 h-5 mr-2 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
            <div>
              <h3 className="text-xl font-bold text-slate-800">Analyzing Document</h3>
              <p className="text-slate-500 text-sm mt-1">This may take a minute while our AI structures your course.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div
              className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors cursor-pointer
                ${file ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50'}
              `}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/pdf"
                className="hidden"
              />

              {!file ? (
                <div className="flex flex-col items-center pointer-events-none">
                  <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700">Click or drag PDF to upload</h3>
                  <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
                    Max size 10MB. We'll extract the text and generate modules safely.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                    <File className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 truncate max-w-xs">
                    {file.name}
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to process
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="mt-4 text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
                  >
                    Remove file
                  </button>
                </div>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={!file}
              whileHover={file ? { scale: 1.02 } : {}}
              whileTap={file ? { scale: 0.98 } : {}}
              className={`w-full py-4 rounded-xl text-lg font-bold shadow-md transition-all flex justify-center items-center
                ${file
                  ? 'bg-emerald-500 text-white shadow-emerald-200 border-2 border-emerald-500 hover:bg-emerald-600'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border-2 border-slate-100'
                }
              `}
            >
              Generate Course
            </motion.button>
          </form>
        )}
      </div>
    </div>
  );
}
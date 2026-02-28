import { useState, useRef, useEffect } from 'react';
import { BookOpen, FileText, CheckCircle, HelpCircle, Briefcase, Lightbulb, Copy, Check, ArrowRight } from 'lucide-react';
import useProgressStore from '../store/progressStore';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function CodeSnippet({ code, language }) {
  const [copied, setCopied] = useState(false);

  // Auto-detect basic language signature
  const detectLanguage = (text) => {
    if (!text) return 'javascript';

    const hasJSXTags = /<[a-z][\s\S]*>/i.test(text) || /<[A-Z][A-Za-z0-9]*\b[^>]*>/.test(text);
    const hasJSKeywords = /(const |let |var |function |=>|import |export |console\.log)/.test(text);
    const hasJSXAttrs = /(className=|onClick=|onChange=)/.test(text);

    if (hasJSXAttrs || (hasJSXTags && hasJSKeywords)) return 'jsx';
    if (hasJSXTags && !hasJSKeywords) return 'html';
    if (/{[\s\S]*:[\s\S]*;/.test(text) && !hasJSKeywords) return 'css';

    return 'javascript';
  };

  // Format single-line minified code (mostly CSS) into multi-line
  const formatSnippet = (text) => {
    try {
      if (!text) return text;
      // If it's already properly multi-line, leave it
      if (text.split('\n').length > 2) return text;

      const lang = detectLanguage(text);
      if (lang === 'css') {
        return text
          .replace(/([{}])/g, ' $1 \n')     // Add newlines around braces
          .replace(/;/g, ';\n  ')           // Add newline and indent after semicolons
          .replace(/\s*\n\s*/g, '\n')       // Clean up consecutive spaces
          .replace(/{\n/g, ' {\n  ')        // Indent contents correctly
          .replace(/\n\s*}/g, '\n}')        // Bring closing brace back
          .replace(/}\n/g, '}\n\n')         // Double space after block
          .trim();
      }
      return text;
    } catch {
      return text;
    }
  };

  const formattedCode = formatSnippet(code);
  const lang = language ? language.toLowerCase() : detectLanguage(code);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-slate-800 shadow-md my-6 w-full max-w-full">
      {/* VS Code Mac Header Style */}
      <div className="bg-[#1e1e1e] flex items-center justify-between px-4 py-3 border-b border-black/50">
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          </div>
          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">{lang} snippet</span>
        </div>
        <button
          onClick={handleCopy}
          className="text-slate-400 hover:text-white transition-colors flex items-center space-x-1"
          aria-label="Copy code"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span className="text-xs font-medium">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      {/* Code Body */}
      <div className="bg-[#1e1e1e] w-full text-sm">
        <SyntaxHighlighter
          language={lang}
          style={vscDarkPlus}
          customStyle={{ margin: 0, padding: '1.5rem', background: '#1e1e1e', fontSize: '0.9rem' }}
          wrapLines={true}
          wrapLongLines={true}
        >
          {formattedCode}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

function InteractiveQuiz({ quiz, lessonId }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const saveQuizScore = useProgressStore(state => state.saveQuizScore);

  const handleSelect = (qIndex, option) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [qIndex]: option
    }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) correctCount++;
    });
    saveQuizScore(lessonId, correctCount, quiz.length);
    setSubmitted(true);
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="flex items-center text-lg font-bold text-emerald-600">
          <CheckCircle className="w-5 h-5 mr-2" /> Knowledge Check
        </h2>
        {submitted && (
          <div className="text-sm font-bold px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">
            Score: {Object.values(selectedAnswers).filter((ans, idx) => ans === quiz[idx].answer).length} / {quiz.length}
          </div>
        )}
      </div>

      <div className="space-y-8">
        {quiz.map((q, idx) => (
          <div key={idx} className="p-6 bg-slate-50 border border-slate-100 rounded-xl">
            <p className="font-bold text-slate-800 mb-4">{idx + 1}. {q.question}</p>
            <div className="space-y-3">
              {q.options?.map((opt, oIdx) => {
                const isSelected = selectedAnswers[idx] === opt;
                let optionStyle = 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 cursor-pointer';

                if (submitted) {
                  optionStyle = 'border-slate-200 bg-white text-slate-400 opacity-60 cursor-default';
                  if (isSelected) {
                    optionStyle = opt === q.answer
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm' // Correctly selected
                      : 'border-red-500 bg-red-50 text-red-800'; // Incorrectly selected
                  } else if (opt === q.answer) {
                    optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 border-dashed'; // Correct answer missed
                  }
                } else if (isSelected) {
                  optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm ring-1 ring-emerald-500';
                }

                return (
                  <div
                    key={oIdx}
                    onClick={() => handleSelect(idx, opt)}
                    className={`p-4 rounded-xl border transition-all ${optionStyle}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{opt}</span>
                      {submitted && isSelected && opt === q.answer && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(selectedAnswers).length < quiz.length}
          className="mt-8 w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          Submit Answers
        </button>
      )}
    </div>
  );
}

export default function LessonViewer({ lesson, onNextLesson }) {
  const completedLessons = useProgressStore(state => state.completedLessons);
  const markLessonComplete = useProgressStore(state => state.markLessonComplete);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [lesson]);

  if (!lesson) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-400 h-full p-8 text-center bg-slate-50">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <BookOpen className="w-12 h-12 text-emerald-200 mx-auto mb-4" />
          <p className="text-lg font-medium text-slate-600">Select a lesson from the sidebar</p>
          <p className="text-sm">Content will appear here to begin learning.</p>
        </div>
      </div>
    );
  }

  const lessonId = String(lesson._id || lesson.id || '');
  const completed = completedLessons.includes(lessonId);

  return (
    <div ref={scrollRef} className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-y-auto bg-slate-50 w-full overflow-x-hidden relative scroll-smooth">
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-8 py-12 space-y-10">
        <h1 className="text-3xl font-bold text-slate-900 font-sans tracking-tight leading-tight">
          {lesson.title}
        </h1>

        {/* Content Section */}
        {lesson.content && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm w-full">
            <h2 className="flex items-center text-lg font-bold text-emerald-600 mb-4">
              <FileText className="w-5 h-5 mr-2 shrink-0" /> Overview
            </h2>
            <div className="prose prose-slate prose-lg max-w-none text-slate-700 font-sans leading-relaxed word-wrap break-words">
              <div dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, '<br />') }} />
            </div>
          </div>
        )}

        {/* Examples Section */}
        {lesson.examples && (
          <div className="bg-emerald-50/50 p-6 sm:p-8 rounded-2xl border border-emerald-100">
            <h2 className="flex items-center text-lg font-bold text-emerald-700 mb-4">
              <Lightbulb className="w-5 h-5 mr-2 shrink-0" /> Examples
            </h2>
            <p className="text-emerald-900 leading-relaxed font-medium">
              {lesson.examples}
            </p>
          </div>
        )}

        {/* Code Snippet Section */}
        {lesson.code && (
          <CodeSnippet code={lesson.code} language={lesson.language} />
        )}

        {/* Quiz Section */}
        {lesson.quiz && lesson.quiz.length > 0 && (
          <InteractiveQuiz key={`quiz-${lesson._id || lesson.id}`} quiz={lesson.quiz} lessonId={lesson._id || lesson.id} />
        )}

        {/* Assignment Section */}
        {lesson.assignment && (
          <div className="bg-amber-50 p-6 sm:p-8 rounded-2xl border border-amber-100">
            <h2 className="flex items-center text-lg font-bold text-amber-700 mb-4">
              <Briefcase className="w-5 h-5 mr-2 shrink-0" /> Assignment
            </h2>
            <p className="text-amber-900 leading-relaxed font-medium">
              {lesson.assignment}
            </p>
          </div>
        )}

        {/* Interview Questions Section */}
        {lesson.interviewQuestions && lesson.interviewQuestions.length > 0 && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="flex items-center text-lg font-bold text-emerald-600 mb-4">
              <HelpCircle className="w-5 h-5 mr-2 shrink-0" /> Interview Preparation
            </h2>
            <ul className="list-disc list-inside space-y-2 text-slate-700 font-medium">
              {lesson.interviewQuestions.map((q, idx) => (
                <li key={idx} className="leading-relaxed">{q}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Completion Action */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-slate-200">
          <button
            onClick={() => markLessonComplete(String(lesson._id || lesson.id || ''))}
            disabled={completed}
            className={`flex items-center px-8 py-4 rounded-xl font-bold text-lg transition-all ${completed
              ? 'bg-emerald-100 text-emerald-600 cursor-default'
              : 'bg-emerald-500 text-white shadow-md hover:bg-emerald-600 hover:shadow-lg active:scale-95'
              }`}
          >
            {completed ? <CheckCircle className="w-6 h-6 mr-2" /> : <BookOpen className="w-6 h-6 mr-2" />}
            {completed ? 'Lesson Completed' : 'Mark as Complete'}
          </button>

          {completed && onNextLesson && (
            <button
              onClick={onNextLesson}
              className="flex items-center px-8 py-4 rounded-xl font-bold text-lg bg-slate-900 text-white shadow-md hover:bg-slate-800 hover:shadow-lg active:scale-95 transition-all outline-none focus:ring-4 focus:ring-slate-900/20"
            >
              Next Lesson <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
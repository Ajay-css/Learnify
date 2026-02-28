import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import ModuleSidebar from '../components/ModuleSidebar';
import LessonViewer from '../components/LessonViewer';

export default function CourseDetails() {
  const { course } = useOutletContext();
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    if (course && course.modules?.length > 0 && course.modules[0].lessons?.length > 0) {
      if (!selectedLesson) {
        setSelectedLesson(course.modules[0].lessons[0]);
      }
    }
  }, [course, selectedLesson]);

  const handleNextLesson = () => {
    if (!course || !course.modules || !selectedLesson) return;

    const currentId = String(selectedLesson._id || selectedLesson.id);

    for (let mIdx = 0; mIdx < course.modules.length; mIdx++) {
      const module = course.modules[mIdx];
      const lIdx = module.lessons.findIndex(l => String(l._id || l.id) === currentId);

      if (lIdx !== -1) {
        if (lIdx < module.lessons.length - 1) {
          // Next lesson in the same module
          setSelectedLesson(module.lessons[lIdx + 1]);
        } else if (mIdx < course.modules.length - 1) {
          // First lesson of the next module
          setSelectedLesson(course.modules[mIdx + 1].lessons[0]);
        } else {
          // Course completed - could redirect or show a confetti screen here
          console.log("Course Completed!");
        }
        return; // Break out immediately once matched
      }
    }
  };

  if (!course) return null;

  return (
    <div className="flex h-full w-full bg-slate-50 relative">
      <ModuleSidebar
        course={course}
        selectedLesson={selectedLesson}
        onSelectLesson={setSelectedLesson}
      />
      <div className="flex-1 w-full flex flex-col overflow-hidden">
        <LessonViewer
          lesson={selectedLesson}
          onNextLesson={handleNextLesson}
        />
      </div>
    </div>
  );
}
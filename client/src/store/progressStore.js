import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Always normalize to string so ObjectId objects don't fail equality checks
const toId = (id) => String(id || '');

const useProgressStore = create(
    persist(
        (set, get) => ({
            completedLessons: [],
            quizScores: {},

            markLessonComplete: (lessonId) => {
                const id = toId(lessonId);
                if (!id) return;
                set((state) => {
                    if (state.completedLessons.includes(id)) return state;
                    return { completedLessons: [...state.completedLessons, id] };
                });
            },

            saveQuizScore: (lessonId, score, total) => {
                const id = toId(lessonId);
                if (!id) return;
                set((state) => ({
                    quizScores: { ...state.quizScores, [id]: { score, total } }
                }));
            },

            isLessonCompleted: (lessonId) => {
                const id = toId(lessonId);
                return get().completedLessons.includes(id);
            },

            getQuizScore: (lessonId) => {
                const id = toId(lessonId);
                return get().quizScores[id] || null;
            },

            clearProgress: () => set({ completedLessons: [], quizScores: {} })
        }),
        {
            name: 'learnify-progress-storage',
        }
    )
);

export default useProgressStore;

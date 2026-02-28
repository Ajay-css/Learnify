import api from './api';

export const courseService = {
  // Create a new course via PDF upload
  createCourse: async (formData) => {
    // Requires multipart/form-data, interceptor or inline override
    const response = await api.post('/courses', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all courses
  getAllCourses: async () => {
    const response = await api.get('/courses');
    return response.data;
  },

  // Get course by ID
  getCourseById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },
};
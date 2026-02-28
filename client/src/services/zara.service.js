import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const sendZaraMessage = ({ userMessage, lessonContext, chatHistory }) =>
    axios.post(`${API_BASE}/zara/chat`, { userMessage, lessonContext, chatHistory });

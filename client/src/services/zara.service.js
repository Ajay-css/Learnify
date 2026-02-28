import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_SERVER}/api`;

export const sendZaraMessage = ({ userMessage, lessonContext, chatHistory }) =>
    axios.post(`${API_BASE}/zara/chat`, { userMessage, lessonContext, chatHistory });

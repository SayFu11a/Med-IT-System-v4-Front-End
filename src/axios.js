import axios from 'axios';

// Для прода (раскомментировать перед пушем)
// export const baseURL = 'https://med-it-system-v4-back-end.onrender.com';

// Для локалки (раскомментировать во время локальной разработки, закомментировать перед пушем)
export const baseURL = 'http://localhost:4444';

const instance = axios.create({
   baseURL,
});

instance.interceptors.request.use((config) => {
   config.headers.Authorization = window.localStorage.getItem('token');
   return config;
});

export default instance;

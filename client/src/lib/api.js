import axios from 'axios';

const api = axios.create({
  baseURL: 'https://kanban-app-3k08.onrender.com/api',
});

const TEMP_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNmVmNzRhMmU3ZmVlYjUwMDViZmVmNyIsImlhdCI6MTc4NTg3NjgwMCwiZXhwIjoxNzg2NDgxNjAwfQ.KJCcoT9Jr367_9cQmAh32PUPkX46LTvJdmfQia_0dzI';

api.interceptors.request.use((config) => {
  config.headers.Authorization = 'Bearer ' + TEMP_TOKEN;
  return config;
});

export default api;

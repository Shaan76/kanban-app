import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

const TEMP_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNmVmNzRhMmU3ZmVlYjUwMDViZmVmNyIsImlhdCI6MTc4NTczMjQzNywiZXhwIjoxNzg2MzM3MjM3fQ.MHKy1tH1jFR1gUrtRI55c03456BsyNhr5TPKni4VFWo';

api.interceptors.request.use((config) => {
  config.headers.Authorization = 'Bearer ' + TEMP_TOKEN;
  return config;
});

export default api;

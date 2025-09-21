import axios from 'axios';

const api = axios.create({
  baseURL: 'https://bookme.com.bd/admin',
  withCredentials: true,
});

export default api;

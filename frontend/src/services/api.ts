import axios from "axios";
// import 'dotenv/config';

/* const apiUrl: string | undefined = process.env.REACT_APP_API_URL;

console.log(process.env) */

export const api = axios.create({
  baseURL: "http://localhost:3000" // apiUrl
});

// Adiciona o token de autenticação a cada requisição se disponível no localStorage
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
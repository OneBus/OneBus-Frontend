import axios from 'axios';

// Cria uma instância do Axios com a URL base da sua API
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1'
});

// Este é o "interceptor". Ele vai "interceptar" todas as requisições
// antes de serem enviadas para o backend.
api.interceptors.request.use(async (config) => {
  // Verificamos se existe um token no localStorage
  const token = localStorage.getItem('authToken');
  
  // Se o token existir, nós o adicionamos ao cabeçalho de autorização
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default api;
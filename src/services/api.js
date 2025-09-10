import axios from 'axios';

// Cria uma instância do Axios com a URL base da API
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1'
});

// add interceptor Ele vai "interceptar" todas as requisições
// antes de serem enviadas para o backend.// verifica se no local storage tem um token se tiver
// adiciona no header da requisição
api.interceptors.request.use(async (config) => {
  // Verificando se existe um token no localStorage
  const token = localStorage.getItem('authToken');
  
  // Se o token existir, add ao cabeçalho de autorização
  if (token) {
    const cleanToken = token.replace(/"/g, '');
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});
// se der erro 401 manada para o login
api.interceptors.response.use( //recebe 2 funções de callback
  (response) => { //arrow function
    return response; // Retorna a resposta normalmente se não houver erro
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error); //retorna o erro para ser tratado onde a requisição foi feita
  }
);

export default api;
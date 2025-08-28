import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  // Verifica se o token existe no localStorage
  const isAuthenticated = !!localStorage.getItem('authToken');

  // Se estiver autenticado, renderiza o componente filho (a página protegida)
  // Se não, redireciona para a página de login
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
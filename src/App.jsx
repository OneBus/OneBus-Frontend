import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

// NOVO: Importe o useNavigate e o Modal
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import Login from './pages/Login/Login';
import AppRoutes from './routes/router';
import PrivateRoute from './routes/PrivateRoute.jsx';
import Modal from './components/Modal/Modal'; // Verifique se este caminho está correto

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  // Estado para controlar o modal de logout
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  // Hook para navegação
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  //  Função que efetivamente faz o logout
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove o token
    navigate('/login'); // Redireciona para rota de login
  };

  // Função para abrir o modal de confirmação
  const promptLogout = () => {
    setLogoutModalOpen(true);
  };

  return (
     <div style={{ display: 'flex' }}>
      {/* 1. PASSAMOS O ESTADO 'isOpen' E A FUNÇÃO 'onToggle' PARA A SIDEBAR */}
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} onLogoutClick={promptLogout} />
      
      <div style={{ flex: 1, marginLeft: isSidebarOpen ? '250px' : '80px', transition: 'margin-left 0.3s ease-in-out' }}>
        <Header onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <AppRoutes />
      </div>

      {/* Modal de confirmação de logout */}
      <Modal isOpen={isLogoutModalOpen} onClose={() => setLogoutModalOpen(false)}>
        <div className="logout-modal-content">
          <h3>Saindo do Sistema</h3>
          <p>Você será desconectado e precisará fazer login novamente para acessar.</p>
          <p>Deseja continuar?</p>
          <div className="logout-modal-buttons">
            <button className="btn-cancel" onClick={() => setLogoutModalOpen(false)}>
              Cancelar
            </button>
            <button className="btn-confirm" onClick={handleLogout}>
              Sim, Sair
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
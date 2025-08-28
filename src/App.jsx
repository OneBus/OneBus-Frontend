import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import Login from './pages/Login/Login';
import AppRoutes from './routes/router';
import PrivateRoute from './routes/PrivateRoute.jsx'; // jsx inves de js

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar isOpen={isSidebarOpen} />
      <div style={{ flex: 1, marginLeft: isSidebarOpen ? '250px' : '0', transition: 'margin-left 0.3s ease-in-out' }}>
        <Header onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <AppRoutes />
      </div>
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
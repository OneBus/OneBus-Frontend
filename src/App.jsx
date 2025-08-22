import React,{ useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import AppRoutes from './routes/router'; 

{/*seção de importação*/}



function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div style={{ display: 'flex'}}>
        <Sidebar isOpen= {isSidebarOpen} />

        <div style={{
          flex:1,
          marginLeft: isSidebarOpen ? '250px' : '0',
          transition: 'margin-left 0.3s ease-in-out',
        }}>

          <Header onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
   <AppRoutes/>
      </div>
      </div>
    </Router>
  );
}

export default App;
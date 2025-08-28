import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import {
  FaUser, FaClock, FaBus, FaRoute, FaWrench, FaUsers, FaSignOutAlt, FaChartLine
} from 'react-icons/fa';

const menuItems = [
  { path: '/funcionario', name: 'Funcionário', icon: <FaUser /> },
  { path: '/funcionario-horario', name: 'Funcionário Horário', icon: <FaClock /> },
  { path: '/veiculo', name: 'Veículo', icon: <FaBus /> },
  { path: '/veiculo-operacao', name: 'Veículo Operação', icon: <FaBus /> },
  { path: '/linha', name: 'Linha', icon: <FaRoute /> },
  { path: '/linha-horario', name: 'Linha Horário', icon:  <FaClock /> },
  { path: '/manutencao', name: 'Manutenção', icon: <FaWrench /> },
  { path: '/usuarios', name: 'Usuários', icon: <FaUsers /> },
];

function Sidebar({ isOpen, onLogoutClick}) {
  // 2. Crie a classe dinâmica baseada no estado 'isOpen'
  const sidebarClass = `${styles.sidebar} ${isOpen ? styles.open : ''}`;

return (
    <div className={sidebarClass}>
      <div className={styles.logo}>
        <FaBus size={30} />
        <h1>OneBus</h1>
      </div>
      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.name}
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      {/* NOVO: Adicione o evento onClick aqui */}
      <div className={styles.logout} onClick={onLogoutClick}>
        <FaSignOutAlt />
        <span>Log out</span>
      </div>
    </div>
  );
}

export default Sidebar;
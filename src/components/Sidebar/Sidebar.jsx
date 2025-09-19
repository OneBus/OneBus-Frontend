import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import {
  FaUser, FaClock, FaBus, FaRoute, FaWrench, FaSignOutAlt, FaBars
} from 'react-icons/fa';

const menuItems = [
  { path: '/funcionario', name: 'Funcionário', icon: <FaUser /> },
  { path: '/funcionario-horario', name: 'Horário do Funcionário', icon: <FaClock /> },
  { path: '/veiculo', name: 'Veículo', icon: <FaBus /> },
  { path: '/veiculo-operacao', name: 'Veículo Operação', icon: <FaBus /> },
  { path: '/linha', name: 'Linha', icon: <FaRoute /> },
  { path: '/linha-horario', name: 'Linha Horário', icon:  <FaClock /> },
  { path: '/manutencao', name: 'Manutenção', icon: <FaWrench /> },
];

// 2. RECEBEMOS A PROP 'onToggle' AQUI
function Sidebar({ isOpen, onToggle, onLogoutClick }) {
  return (
    // A classe 'expanded' é controlada pela prop 'isOpen'
    <div className={`${styles.sidebar} ${isOpen ? styles.expanded : ''}`}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <h1>OneBus</h1>
        </div>
        {/* 3. A FUNÇÃO 'onToggle' É USADA AQUI NO ONCLICK */}
        <button className={styles.hamburgerButton} onClick={onToggle}>
          <FaBars />
        </button>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <NavLink to={item.path} key={item.name} className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
            title={item.name} // O atributo 'title' é crucial para o tooltip
          >
            {item.icon}
            <span className={styles.linkName}>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className={styles.logout} onClick={onLogoutClick}>
        <FaSignOutAlt />
        <span className={styles.linkName}>Log out</span>
      </div>
    </div>
  );
}

export default Sidebar;
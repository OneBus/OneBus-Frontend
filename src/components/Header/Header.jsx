import React from 'react';
import styles from './Header.module.css';
// 1. Importe o ícone do menu hambúrguer
import { FaBars, FaSearch, FaUserCircle } from 'react-icons/fa';

// 2. Receba as props 'onToggleSidebar' e 'isSidebarOpen'
function Header({ onToggleSidebar, isSidebarOpen }) {
  // 3. Crie a classe dinâmica para o header ajustar sua posição
  const headerClass = `${styles.header} ${!isSidebarOpen ? styles.sidebarClosed : ''}`;

  return (
    <header className={headerClass}>
      <div className={styles.leftContent}>
        {/* 4. Adicione o botão com o evento onClick */}
        <button className={styles.menuButton} onClick={onToggleSidebar}>
          <FaBars />
        </button>
        <div className={styles.title}>
          <h1>OneBus</h1>
        </div>
      </div>
     
    
    
    </header>
  );
}

export default Header;
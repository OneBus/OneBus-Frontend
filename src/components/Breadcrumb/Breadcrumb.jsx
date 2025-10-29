import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Breadcrumb.module.css';

// Mapeamento simples para nomes mais amigáveis (pode ser expandido)
const breadcrumbNameMap = {
  'funcionario': 'Funcionários',
  'funcionarios': 'Funcionários',
  'funcionario-horario': 'Horário Funcionário',
  'funcionarios-horarios': 'Horário Funcionário',
  'veiculo': 'Veículos',
  'veiculos': 'Veículos',
  'veiculo-operacao': 'Operações',
  'linha': 'Linhas',
  'linhas': 'Linhas',
  'linha-horario': 'Horário Linha',
  'linhas-horarios': 'Horário Linha',
  'manutencao': 'Manutenções',
  'manutencoes': 'Manutenções',
  'cadastrar': 'Cadastro',
  'editar': 'Edição',
};

function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x); // Divide e filtra segmentos vazios

  // Se estiver na raiz, não mostra breadcrumb (ou mostra só Home)
  if (pathnames.length === 0) {
    return null; // Ou <nav><Link to="/">Home</Link></nav> se preferir
  }

  return (
    <nav aria-label="breadcrumb" className={styles.breadcrumb}>
      <Link to="/" className={styles.breadcrumbLink}>Início</Link>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        // Ignora IDs numéricos na URL (ex: /editar/123)
        if (!isNaN(parseInt(value))) return null; 

        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        // Usa o mapeamento ou o próprio valor capitalizado
        const name = breadcrumbNameMap[value] || value.charAt(0).toUpperCase() + value.slice(1);

        return (
          <React.Fragment key={to}>
            <span className={styles.breadcrumbSeparator}> &gt; </span>
            {last ? (
              <span className={styles.breadcrumbCurrent}>{name}</span>
            ) : (
              <Link to={to} className={styles.breadcrumbLink}>{name}</Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export default Breadcrumb;
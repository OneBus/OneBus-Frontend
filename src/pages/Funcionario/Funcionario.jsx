import React from 'react';
import styles from './Funcionario.module.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const funcionariosData = [
  { name: 'Eduardo Moises', cargo: 'CEO', codigo: '21649'},
  { name: 'Gui Francini', cargo: 'CEO', codigo: '21852' },
  { name: 'Brunão', cargo: 'Motorista', codigo: '21447'  },
  { name: 'Guilherme Beserra', cargo: 'Fiscal', codigo: '21448' },
 
];

function Funcionario() {

   const navigate = useNavigate(); // 2. Inicialize o hook

  // 3. Função que será chamada pelo botão
  const handleCadastrarClick = () => {
    navigate('/funcionarios/cadastrar'); // Navega para a nova rota
  };


  return (
    <div className={styles.container}>
      <div className={styles.actions}>
            <div className={styles.title}>
                <h1>Funcionários</h1>
            </div>

        <button className={styles.cadastrarBtn} onClick={handleCadastrarClick}>
          Cadastrar Funcionário
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Cargo</th>
              <th>Código</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {funcionariosData.map((func, index) => (
              <tr key={index}>
                <td className={styles.user}>
                    <div className={styles.userAvatar} style={{ backgroundColor: '#ccc' }}></div>
                    {func.name}
                </td>
                <td>{func.cargo}</td>
                <td>{func.codigo}</td>
               
                <td className={styles.actionIcons}>
                  <FaEdit />
                  <FaTrash />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
</div>
      );
      }
  


export default Funcionario;
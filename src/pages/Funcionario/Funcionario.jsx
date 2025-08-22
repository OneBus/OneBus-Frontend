import React, { useState } from 'react';
import styles from './Funcionario.module.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Modal from '../../components/Modal/Modal';

const funcionariosData = [
  { name: 'Eduardo Moises', cargo: 'CEO', codigo: '21649'},
  { name: 'Gui Francini', cargo: 'CEO', codigo: '21852' },
  { name: 'Brunão', cargo: 'Motorista', codigo: '21447'  },
  { name: 'Guilherme Beserra', cargo: 'Fiscal', codigo: '21448' },
 
];

function Funcionario() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.actions}>
            <div className={styles.title}>
                <h1>Funcionários</h1>
              </div>

        <button className={styles.cadastrarBtn} onClick={() => setIsModalOpen(true)}>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className={styles.modalContent}>
          <h2>Cadastrar Novo Funcionário</h2>
          {/*Nome*/}
          <div className={styles.formGroup}>
            <label htmlFor="nome">Nome</label>
            <input type="text" id="nome" />
          </div>
          {/*cargo*/}
          <div className={styles.formGroup}>
            <label htmlFor="cargo">Cargo</label>
            <input type="text" id="cargo" />
          </div>
          {/*codigo*/}
          <div className={styles.formGroup}>
            <label htmlFor="codigo">Código</label>
            <input type="text" id="codigo" />
          </div>
      {/*btn cadastrar*/}
          <button className={styles.cadastrarBtn}>Cadastrar</button>
        </div>
      </Modal>
    </div>
  );
}

export default Funcionario;
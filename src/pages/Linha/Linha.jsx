import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Linha.module.css'; // Usando o CSS copiado
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import Modal from '../../components/Modal/Modal';

// Dados estáticos para o mockup da tabela de linhas
const mockData = [
  { id: 1, numero: '824EX1', nome: 'Pirapora Do Bom Jesus (Pq. Paiol) - Barueri (Centro)', sentido: 'Volta' },
  { id: 2, numero: '082DV1', nome: 'Pirapora Do Bom Jesus (Jd.Bom Jesus Via Paiol)- Osasco (Vila-Yara)', sentido: 'Ida ' },
  { id: 3, numero: '467', nome: 'Santana de Parníba (Centro) - São Paulo (Lapa)', sentido: 'Ida' },
  { id: 4, numero: '830-2', nome: 'Centro Parnaíba - Jaguari', sentido: 'Circular' },
];

function Linha() {
  const navigate = useNavigate();

  const [lineToDelete, setLineToDelete] = useState(null);

  const handleCadastrarClick = () => {
    navigate('/linha/cadastrar');
  };

  const handleEditClick = (id) => {
    navigate(`/linha/editar/${id}`);
  };

  const handleDeleteClick = (line) => {
    setLineToDelete(line);
  };

  const handleConfirmDelete = () => {
    console.log("Deletando linha:", lineToDelete);
    setLineToDelete(null); // Apenas fecha o modal no mockup
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <h1>Linhas</h1>
        <button className={styles.cadastrarBtn} onClick={handleCadastrarClick}>
          Cadastrar Linha
        </button>
      </div>
      
      <div className={styles.filterBar}>
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input name="value" type="text" placeholder="Pesquisar por nome ou número..." className={styles.searchInput}/>
        </div>
        <select className={styles.filterSelect}>
          <option value="">Todos os Sentidos</option>
          <option value="ida">Ida</option>
          <option value="volta">Volta</option>
          <option value="circular">Circular</option>
        </select>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Número</th>
              <th>Nome da Linha</th>
              <th>Sentido</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((linha) => (
              <tr key={linha.id}>
                <td>{linha.numero}</td>
                <td>{linha.nome}</td>
                <td>{linha.sentido}</td>
                <td className={styles.actionIcons}>
                  <FaEdit title="Editar" onClick={() => handleEditClick(linha.id)} />
                  <FaTrash title="Excluir" onClick={() => handleDeleteClick(linha)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!lineToDelete} onClose={() => setLineToDelete(null)}>
        <div className="logout-modal-content">
          <h3>Confirmar Exclusão</h3>
          <p>
            Tem certeza que deseja excluir a linha 
            <strong> {lineToDelete?.nome}</strong>?
          </p>
          <div className="logout-modal-buttons">
            <button className="btn-cancel" onClick={() => setLineToDelete(null)}>Cancelar</button>
            <button className="btn-confirm" onClick={handleConfirmDelete}>Sim, Excluir</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Linha;
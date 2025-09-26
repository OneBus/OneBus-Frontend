import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Manutencao.module.css'; // Usando o CSS copiado
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import Modal from '../../components/Modal/Modal';

// Dados estáticos para o mockup da tabela
const mockData = [
  { id: 1, setor: 'Mecânica', descricao: 'Troca de óleo e filtros do motor do veículo ', dataInicio: '15/09/2025 08:00', dataFim: '15/09/2025 10:30', vistoriaVencimento: '20/12/2025' },
  { id: 2, setor: 'Borracharia', descricao: 'Rodízio e calibragem de pneus do veículo ', dataInicio: '16/09/2025 09:00', dataFim: '16/09/2025 09:45', vistoriaVencimento: 'N/A' },
  { id: 3, setor: 'Funilaria', descricao: 'Reparo no para-choque dianteiro do veículo ', dataInicio: '18/09/2025 14:00', dataFim: '19/09/2025 17:00', vistoriaVencimento: '05/11/2025' },
  { id: 4, setor: 'Outros', descricao: 'Limpeza e higienização interna completa', dataInicio: '20/09/2025 11:00', dataFim: '20/09/2025 15:00', vistoriaVencimento: 'N/A' },
];

function Manutencao() {
  const navigate = useNavigate();

  const [manutencaoToDelete, setManutencaoToDelete] = useState(null);

  const handleCadastrarClick = () => {
    navigate('/manutencao/cadastrar');
  };

  const handleEditClick = (id) => {
    navigate(`/manutencao/editar/${id}`);
  };

  const handleDeleteClick = (manutencao) => {
    setManutencaoToDelete(manutencao);
  };

  const handleConfirmDelete = () => {
    console.log("Deletando manutenção:", manutencaoToDelete);
    setManutencaoToDelete(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <h1>Manutenções</h1>
        <button className={styles.cadastrarBtn} onClick={handleCadastrarClick}>
          Agendar Manutenção
        </button>
      </div>
      
      <div className={styles.filterBar}>
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input name="value" type="text" placeholder="Pesquisar por descrição..." className={styles.searchInput}/>
        </div>
        {/* Filtro de Setor */}
        <select className={styles.filterSelect}>
          <option value="">Todos os Setores</option>
          <option value="borracharia">Borracharia</option>
          <option value="funilaria">Funilaria</option>
          <option value="mecanica">Mecânica</option>
          <option value="outros">Outros</option>
        </select>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Setor</th>
              <th>Descrição</th>
              <th>Data Início</th>
              <th>Data Fim</th>
              <th>Venc. Vistoria</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((item) => (
              <tr key={item.id}>
                <td>{item.setor}</td>
                <td>{item.descricao}</td>
                <td>{item.dataInicio}</td>
                <td>{item.dataFim}</td>
                <td>{item.vistoriaVencimento}</td>
                <td className={styles.actionIcons}>
                  <FaEdit title="Editar" onClick={() => handleEditClick(item.id)} />
                  <FaTrash title="Excluir" onClick={() => handleDeleteClick(item)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!manutencaoToDelete} onClose={() => setManutencaoToDelete(null)}>
        <div className="logout-modal-content">
          <h3>Confirmar Exclusão</h3>
          <p>
            Tem certeza que deseja excluir o agendamento para 
            <strong> {manutencaoToDelete?.descricao}</strong>?
          </p>
          <div className="logout-modal-buttons">
            <button className="btn-cancel" onClick={() => setManutencaoToDelete(null)}>Cancelar</button>
            <button className="btn-confirm" onClick={handleConfirmDelete}>Sim, Excluir</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Manutencao;
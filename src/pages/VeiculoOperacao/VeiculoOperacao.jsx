import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './VeiculoOperacao.module.css'; // Usando o CSS copiado
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import Modal from '../../components/Modal/Modal';

// Dados estáticos para o mockup da tabela
const mockData = [
  { id: 1, linhaNome: '082 - PIRAPORA (JD. BOM JESUS)', funcionarioNome: 'Bruno Berdinazzi Mezenga', veiculoModelo: 'Apache Vip IV', horaInicio: '05:00', horaFim: '14:00' },
  { id: 2, linhaNome: '054 - CAJAMAR (JORDANESIA)', funcionarioNome: 'Guilherme Beserra', veiculoModelo: 'Viale BRS', horaInicio: '05:30', horaFim: '14:30' },
  { id: 3, linhaNome: '082 - PIRAPORA (JD. BOM JESUS)', funcionarioNome: 'Carlos Andrade', veiculoModelo: 'Apache Vip IV', horaInicio: '14:00', horaFim: '23:00' },
  { id: 4, linhaNome: '054 - CAJAMAR (JORDANESIA)', funcionarioNome: 'Mariana Costa', veiculoModelo: 'Viale BRS', horaInicio: '14:30', horaFim: '23:30' },
];

function VeiculoOperacao() {
  const navigate = useNavigate();

  const [operationToDelete, setOperationToDelete] = useState(null);

  const handleCadastrarClick = () => {
    navigate('/veiculo-operacao/cadastrar');
  };

  const handleEditClick = (id) => {
    navigate(`/veiculo-operacao/editar/${id}`);
  };

  const handleDeleteClick = (operation) => {
    setOperationToDelete(operation);
  };

  const handleConfirmDelete = () => {
    console.log("Deletando operação:", operationToDelete);
    setOperationToDelete(null); // Apenas fecha o modal no mockup
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <h1>Operações de Veículos</h1>
        <button className={styles.cadastrarBtn} onClick={handleCadastrarClick}>
          Criar Operação
        </button>
      </div>
      
      <div className={styles.filterBar}>
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input name="value" type="text" placeholder="Pesquisar..." className={styles.searchInput}/>
        </div>
        {/* Filtro de Linha */}
        <select className={styles.filterSelect}>
          <option value="">Todas as Linhas</option>
          <option value="1">082 - PIRAPORA (JD. BOM JESUS)</option>
          <option value="2">054 - CAJAMAR (JORDANESIA)</option>
        </select>
        {/* Filtro de Funcionário */}
        <select className={styles.filterSelect}>
          <option value="">Todos os Funcionários</option>
          <option value="1">Bruno Berdinazzi Mezenga</option>
          <option value="2">Guilherme Beserra</option>
        </select>
        {/* Filtro de Veículo */}
        <select className={styles.filterSelect}>
          <option value="">Todos os Veículos</option>
          <option value="1">Apache Vip IV</option>
          <option value="2">Viale BRS</option>
        </select>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Linha</th>
              <th>Funcionário</th>
              <th>Veículo</th>
              <th>Hora Início</th>
              <th>Hora Fim</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((operacao) => (
              <tr key={operacao.id}>
                <td>{operacao.linhaNome}</td>
                <td>{operacao.funcionarioNome}</td>
                <td>{operacao.veiculoModelo}</td>
                <td>{operacao.horaInicio}</td>
                <td>{operacao.horaFim}</td>
                <td className={styles.actionIcons}>
                  <FaEdit title="Editar" onClick={() => handleEditClick(operacao.id)} />
                  <FaTrash title="Excluir" onClick={() => handleDeleteClick(operacao)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!operationToDelete} onClose={() => setOperationToDelete(null)}>
        <div className="logout-modal-content">
          <h3>Confirmar Exclusão</h3>
          <p>
            Tem certeza que deseja excluir a operação da linha 
            <strong> {operationToDelete?.linhaNome}</strong> com o funcionário 
            <strong> {operationToDelete?.funcionarioNome}</strong>?
          </p>
          <div className="logout-modal-buttons">
            <button className="btn-cancel" onClick={() => setOperationToDelete(null)}>Cancelar</button>
            <button className="btn-confirm" onClick={handleConfirmDelete}>Sim, Excluir</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default VeiculoOperacao;
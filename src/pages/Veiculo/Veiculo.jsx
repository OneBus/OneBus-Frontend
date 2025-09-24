import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Veiculo.module.css'; // Usando o CSS copiado
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import Modal from '../../components/Modal/Modal';

// Dados estáticos para o mockup da tabela de veículos
const mockData = [
  { id: 1, prefixo: '1001', modelo: 'Marcopolo Torino', modeloChassi: 'Mercedes-Benz OF-1721', placa: 'ABC-1234', portasEsquerdas: true, status: 'Ativo' },
  { id: 2, prefixo: '1002', modelo: 'Caio Apache Vip IV', modeloChassi: 'Volkswagen 17.230', placa: 'DEF-5678', portasEsquerdas: false, status: 'Em Manutenção' },
  { id: 3, prefixo: '2005', modelo: 'Marcopolo Senior', modeloChassi: 'Agrale MA 10.0', placa: 'GHI-9101', portasEsquerdas: false, status: 'Ativo' },
  { id: 4, prefixo: '3010', modelo: 'Irizar i6', modeloChassi: 'Scania K360', placa: 'JKL-1121', portasEsquerdas: true, status: 'Inativo' },
];

function Veiculo() {
  const navigate = useNavigate();
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  const handleCadastrarClick = () => {
    navigate('/veiculo/cadastrar');
  };

  const handleEditClick = (id) => {
    navigate(`/veiculo/editar/${id}`);
  };

  const handleDeleteClick = (vehicle) => {
    setVehicleToDelete(vehicle);
  };

  const handleConfirmDelete = () => {
    console.log("Deletando veículo:", vehicleToDelete);
    setVehicleToDelete(null); // Apenas fecha o modal no mockup
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <h1>Veículos</h1>
        <button className={styles.cadastrarBtn} onClick={handleCadastrarClick}>
          Cadastrar Veículo
        </button>
      </div>
      
      <div className={styles.filterBar}>
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input name="value" type="text" placeholder="Pesquisar por placa, prefixo..." className={styles.searchInput}/>
        </div>
        <select className={styles.filterSelect}>
          <option value="">Todos os Status</option>
          <option value="ativo">Ativo</option>
          <option value="manutencao">Em Manutenção</option>
          <option value="inativo">Inativo</option>
        </select>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Prefixo</th>
              <th>Modelo</th>
              <th>Modelo do Chassi</th>
              <th>Placa</th>
              <th>Portas à Esquerda</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((veiculo) => (
              <tr key={veiculo.id}>
                <td>{veiculo.prefixo}</td>
                <td>{veiculo.modelo}</td>
                <td>{veiculo.modeloChassi}</td>
                <td>{veiculo.placa}</td>
                <td>{veiculo.portasEsquerdas ? 'Sim' : 'Não'}</td>
                <td>{veiculo.status}</td>
                <td className={styles.actionIcons}>
                  <FaEdit title="Editar" onClick={() => handleEditClick(veiculo.id)} />
                  <FaTrash title="Excluir" onClick={() => handleDeleteClick(veiculo)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!vehicleToDelete} onClose={() => setVehicleToDelete(null)}>
        <div className="logout-modal-content">
          <h3>Confirmar Exclusão</h3>
          <p>
            Tem certeza que deseja excluir o veículo de placa 
            <strong> {vehicleToDelete?.placa}</strong>?
          </p>
          <div className="logout-modal-buttons">
            <button className="btn-cancel" onClick={() => setVehicleToDelete(null)}>Cancelar</button>
            <button className="btn-confirm" onClick={handleConfirmDelete}>Sim, Excluir</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Veiculo;
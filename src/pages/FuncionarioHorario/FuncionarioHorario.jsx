import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FuncionarioHorario.module.css';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import api from '../../services/api';
import Modal from '../../components/Modal/Modal';
import { generatePageNumbers } from '../../utils/pagination';

// Hook de Debounce
const mockData = [
  { id: 1, funcionarioName: 'Clodoaldo Reis Pierre', diaSemana: 'Segunda a Sexta', entrada: '08:00', saida: '17:00' },
  { id: 2, funcionarioName: 'Mariana Costa', diaSemana: 'Segunda a Sexta', entrada: '09:00', saida: '18:00' },
  { id: 3, funcionarioName: 'Carlos Andrade', diaSemana: 'Sábados', entrada: '08:00', saida: '12:00' },
  { id: 4, funcionarioName: 'Beatriz Lima', diaSemana: 'Domingos e Feriados', entrada: '10:00', saida: '16:00' },
];

function FuncionarioHorario() {
  const navigate = useNavigate();

  // Estado apenas para controlar o modal de exclusão
  const [horarioToDelete, setHorarioToDelete] = useState(null);

  // Navega para a tela de cadastro de horário
  const handleCadastrarClick = () => {
    navigate('/funcionarios-horarios/cadastrar');
  };

  // Navega para a tela de edição de horário com o ID
  const handleEditClick = (id) => {
    navigate(`/funcionarios-horarios/editar/${id}`);
  };

  // Abre o modal de confirmação de exclusão
  const handleDeleteClick = (horario) => {
    setHorarioToDelete(horario);
  };

  // Ação de confirmar a exclusão (apenas fecha o modal no mockup)
  const handleConfirmDelete = () => {
    console.log("Deletando horário:", horarioToDelete);
    setHorarioToDelete(null); // Fecha o modal
  };


  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <h1>Horários dos Funcionários</h1>
        <button className={styles.cadastrarBtn} onClick={handleCadastrarClick}>
          Cadastrar Horário
        </button>
      </div>
      
      {/* A barra de filtros pode ser mantida para consistência visual */}
      <div className={styles.filterBar}>
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input name="value" type="text" placeholder="Pesquisar por funcionário..." className={styles.searchInput}/>
        </div>
        {/* Adicione outros filtros se necessário */}
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Funcionário</th>
              <th>Dia da Semana</th>
              <th>Entrada</th>
              <th>Saída</th>
            
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((horario) => (
              <tr key={horario.id}>
                {/* Usamos a classe .user para manter o estilo do avatar */}
                <td className={styles.user}>
                  <img
                    src={`https://ui-avatars.com/api/?name=${horario.funcionarioName}&background=random`}
                    alt={`Foto de ${horario.funcionarioName}`}
                    className={styles.userAvatar}
                  />
                  {horario.funcionarioName}
                </td>
                <td>{horario.diaSemana}</td>
                <td>{horario.entrada}</td>
                <td>{horario.saida}</td>
              
                <td className={styles.actionIcons}>
                  <FaEdit title="Editar" onClick={() => handleEditClick(horario.id)} />
                  <FaTrash title="Excluir" onClick={() => handleDeleteClick(horario)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!horarioToDelete} onClose={() => setHorarioToDelete(null)}>
        <div className="logout-modal-content">
          <h3>Confirmar Exclusão</h3>
          <p>
            Tem certeza que deseja excluir o horário do funcionário 
            <strong> {horarioToDelete?.funcionarioName}</strong>?
          </p>
          <div className="logout-modal-buttons">
            <button className="btn-cancel" onClick={() => setHorarioToDelete(null)}>Cancelar</button>
            <button className="btn-confirm" onClick={handleConfirmDelete}>Sim, Excluir</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
export default FuncionarioHorario;
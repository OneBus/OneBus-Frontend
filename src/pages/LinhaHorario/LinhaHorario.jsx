import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LinhaHorario.module.css'; // Usando o CSS copiado
import { FaEdit, FaTrash } from 'react-icons/fa';
import Modal from '../../components/Modal/Modal';

// Dados estáticos para o mockup da tabela
const mockData = [
  { id: 1, linhaNome: '824EX1 - Pirapora Do Bom Jesus (Pq. Paiol) - Barueri (Centro)', horaInicio: '03:10', horaFim: '00:30', dia: 'Segunda a Sexta' },
  { id: 2, linhaNome: '824EX1 - Pirapora Do Bom Jesus (Pq. Paiol) - Barueri (Centro)', horaInicio: '04:30', horaFim: '00:00', dia: 'Domingos e Feriados' },
  { id: 3, linhaNome: '824EX1 - Pirapora Do Bom Jesus (Pq. Paiol) - Barueri (Centro)', horaInicio: '05:00', horaFim: '23:30', dia: 'Sábados' },

];

function LinhaHorario() {
  const navigate = useNavigate();

  const [horarioToDelete, setHorarioToDelete] = useState(null);

  const handleCadastrarClick = () => {
    navigate('/linha-horario/cadastrar');
  };

  const handleEditClick = (id) => {
    navigate(`/linha-horario/editar/${id}`);
  };

  const handleDeleteClick = (horario) => {
    setHorarioToDelete(horario);
  };

  const handleConfirmDelete = () => {
    console.log("Deletando horário da linha:", horarioToDelete);
    setHorarioToDelete(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <h1>Horários das Linhas</h1>
        <button className={styles.cadastrarBtn} onClick={handleCadastrarClick}>
          Cadastrar Horário
        </button>
      </div>
      
      <div className={styles.filterBar}>
        {/* Filtro de Linha */}
        <select className={styles.filterSelect}>
          <option value="">Todas as Linhas</option>
          <option value="824EX1">824EX1 - Pirapora Do Bom Jesus (Pq. Paiol) - Barueri (Centro)</option>
          <option value="577P-10">809 - Aldeia da Serra</option>
        </select>

        {/* Filtro de Dia */}
        <select className={styles.filterSelect}>
          <option value="">Todos os Dias</option>
          <option value="seg-sex">Segunda a Sexta</option>
          <option value="sab">Sábados</option>
          <option value="dom-fer">Domingos e Feriados</option>
        </select>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Linha</th>
              <th>Hora Início</th>
              <th>Hora Fim</th>
              <th>Dia</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((horario) => (
              <tr key={horario.id}>
                <td>{horario.linhaNome}</td>
                <td>{horario.horaInicio}</td>
                <td>{horario.horaFim}</td>
                <td>{horario.dia}</td>
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
            Tem certeza que deseja excluir o horário da linha 
            <strong> {horarioToDelete?.linhaNome}</strong>?
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

export default LinhaHorario;
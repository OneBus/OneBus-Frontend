import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../FuncionarioHorarioCadastro/FuncionarioHorarioCadastro.module.css'; // Reutilizando estilos
import api from '../../services/api';
import Modal from '../../components/Modal/Modal';

function FuncionarioHorarioEdicao() {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o ID do horário da URL

  // Estado para os dados do formulário
  const [formData, setFormData] = useState({});
  
  // Estado para popular o menu de funcionários
  const [employees, setEmployees] = useState([]);

  // Estados de controle
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ isOpen: false, message: '', isError: false });

  // Efeito para buscar tanto os dados do horário quanto a lista de funcionários
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Busca as duas informações em paralelo
        const [scheduleRes, employeesRes] = await Promise.all([
          api.get(`/employee-schedules/${id}`), // Assumindo este endpoint para buscar um horário
          api.get('/employees', { params: { PageSize: 1000 } })
        ]);
        
        // Popula o menu de funcionários
        setEmployees(employeesRes.data.value.items || []);

        // Popula o formulário com os dados do horário
        setFormData(scheduleRes.data.value);

      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setFeedback({ isOpen: true, message: "Não foi possível carregar os dados para edição.", isError: true });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]); // Roda sempre que o ID na URL mudar

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // ATENÇÃO: Assumindo que o endpoint para atualizar um horário seja este.
      // Verifique com o backend a rota e o formato do payload corretos.
      await api.put(`/employee-schedules/${id}`, formData); 
      setFeedback({ isOpen: true, message: 'Horário atualizado com sucesso!', isError: false });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar o horário.';
      setFeedback({ isOpen: true, message: errorMessage, isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setFeedback({ isOpen: false, message: '', isError: false });
    if (!feedback.isError) {
      navigate('/funcionario-horario');
    }
  };

  if (loading) return <p className={styles.container}>Carregando dados do horário...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Editar Horário</h1>
        <button onClick={() => navigate('/funcionario-horario')} className={styles.backButton}>
          Voltar para a Lista
        </button>
      </div>
      
      <form className={styles.form} onSubmit={handleUpdate}>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label htmlFor="employeeId">Funcionário</label>
            <select name="employeeId" value={formData.employeeId || ''} onChange={handleChange} required>
              <option value="">Selecione um funcionário...</option>
              {employees.map(employee => (
                <option key={employee.id} value={employee.id}>{employee.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="weekDay">Dia da Semana</label>
            <input name="weekDay" type="text" placeholder="Ex: Segunda a Sexta" value={formData.weekDay || ''} onChange={handleChange} required />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="startTime">Horário de Entrada</label>
            <input name="startTime" type="time" value={formData.startTime || ''} onChange={handleChange} required />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="endTime">Horário de Saída</label>
            <input name="endTime" type="time" value={formData.endTime || ''} onChange={handleChange} required />
          </div>

   
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.saveButton} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>

      <Modal isOpen={feedback.isOpen} onClose={handleCloseModal}>
        <div className="feedback-modal-content">
          <h3>{feedback.isError ? 'Ocorreu um Erro' : 'Sucesso!'}</h3>
          <p>{feedback.message}</p>
          <button onClick={handleCloseModal} className="feedback-modal-button">Fechar</button>
        </div>
      </Modal>
    </div>
  );
}

export default FuncionarioHorarioEdicao;
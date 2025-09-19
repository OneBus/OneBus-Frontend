import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FuncionarioHorarioCadastro.module.css'; // Usando o CSS copiado
import api from '../../services/api';
import Modal from '../../components/Modal/Modal';

function FuncionarioHorarioCadastro() {
  const navigate = useNavigate();

  // Estado para os dados do formulário
  const [formData, setFormData] = useState({
    employeeId: '',
    weekDay: '',
    startTime: '',
    endTime: '',
    breakTime: '',
  });

  // Estado para popular o menu de funcionários
  const [employees, setEmployees] = useState([]);
  
  // Estados de controle
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ isOpen: false, message: '', isError: false });

  // Efeito para buscar a lista de funcionários quando a página carregar
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        // Usando o endpoint de listagem que já temos, sem paginação para pegar todos
        const response = await api.get('/employees', { params: { PageSize: 1000 } });
        setEmployees(response.data.value.items || []);
      } catch (err) {
        console.error("Erro ao buscar funcionários:", err);
        setFeedback({ isOpen: true, message: "Não foi possível carregar a lista de funcionários.", isError: true });
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validação simples
    if (!formData.employeeId || !formData.weekDay || !formData.startTime || !formData.endTime) {
      setFeedback({ isOpen: true, message: 'Preencha todos os campos obrigatórios.', isError: true });
      setLoading(false);
      return;
    }
    
    try {
      // ATENÇÃO: Assumindo que o endpoint para criar um horário seja este.
      // Verifique com o backend qual é a rota e o formato do payload corretos.
      await api.post('/employee-schedules', formData); 
      setFeedback({ isOpen: true, message: 'Horário cadastrado com sucesso!', isError: false });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao cadastrar o horário.';
      setFeedback({ isOpen: true, message: errorMessage, isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setFeedback({ isOpen: false, message: '', isError: false });
    if (!feedback.isError) {
      navigate('/funcionario-horario'); // Volta para a lista de horários
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Cadastrar Novo Horário</h1>
        <button onClick={() => navigate('/funcionario-horario')} className={styles.backButton}>
          Voltar para a Lista
        </button>
      </div>
      
      <form className={styles.form} onSubmit={handleSave}>
        <div className={styles.formGrid}>
          {/* Menu de seleção para Funcionário */}
          <div className={styles.inputGroup}>
            <label htmlFor="employeeId">Funcionário</label>
            <select name="employeeId" value={formData.employeeId} onChange={handleChange} required>
              <option value="">Selecione um funcionário...</option>
              {employees.map(employee => (
                <option key={employee.id} value={employee.id}>{employee.name}</option>
              ))}
            </select>
          </div>

          {/* Campo Dia da Semana */}
          <div className={styles.inputGroup}>
            <label htmlFor="weekDay">Dia da Semana</label>
            <input name="weekDay" type="text" placeholder="Ex: Segunda a Sexta" value={formData.weekDay} onChange={handleChange} required />
          </div>

          {/* Campo Entrada */}
          <div className={styles.inputGroup}>
            <label htmlFor="startTime">Horário de Entrada</label>
            <input name="startTime" type="time" value={formData.startTime} onChange={handleChange} required />
          </div>

          {/* Campo Saída */}
          <div className={styles.inputGroup}>
            <label htmlFor="endTime">Horário de Saída</label>
            <input name="endTime" type="time" value={formData.endTime} onChange={handleChange} required />
          </div>

          {/* Campo Intervalo */}
      
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.saveButton} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Horário'}
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

export default FuncionarioHorarioCadastro;
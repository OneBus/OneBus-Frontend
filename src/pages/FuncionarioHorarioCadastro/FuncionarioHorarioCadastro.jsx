import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FuncionarioHorarioCadastro.module.css';
import api from '../../services/api';
import Modal from '../../components/Modal/Modal';

function FuncionarioHorarioCadastro() {
  const navigate = useNavigate();

  // Estado alinhado com a API: employeeId, dayType, startTime, endTime
  const [formData, setFormData] = useState({
    employeeId: '',
    dayType: '',
    startTime: '',
    endTime: '',
  });

  // Estados para popular os menus
  const [employees, setEmployees] = useState([]);
  const [dayTypeOptions, setDayTypeOptions] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ isOpen: false, message: '', isError: false });

  // Busca tanto a lista de funcionários quanto os tipos de dia
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeesRes, dayTypesRes] = await Promise.all([
          api.get('/employees', { params: { PageSize: 1000 } }),
          api.get('/employeesWorkdays/daysTypes')
        ]);
        setEmployees(employeesRes.data.value.items || []);
        setDayTypeOptions(dayTypesRes.data.value || []);
      } catch (err) {
        console.error("Erro ao carregar dados do formulário:", err);
        setFeedback({ isOpen: true, message: "Não foi possível carregar os dados necessários.", isError: true });
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.employeeId || !formData.dayType || !formData.startTime || !formData.endTime) {
      setFeedback({ isOpen: true, message: 'Preencha todos os campos obrigatórios.', isError: true });
      setLoading(false);
      return;
    }
    
    // Converte os IDs para número antes de enviar
    const payload = {
      employeeId: parseInt(formData.employeeId, 10),
      dayType: parseInt(formData.dayType, 10),
      startTime: formData.startTime,
      endTime: formData.endTime,
    };
    
    try {
      // Endpoint para criar um novo registro de horário
      await api.post('/employeesWorkdays', payload); 
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
      navigate('/funcionario-horario');
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

          {/* Menu de seleção para Tipo de Dia */}
          <div className={styles.inputGroup}>
            <label htmlFor="dayType">Tipo de Dia</label>
            <select name="dayType" value={formData.dayType} onChange={handleChange} required>
              <option value="">Selecione o tipo...</option>
              {dayTypeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.name}</option>
              ))}
            </select>
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
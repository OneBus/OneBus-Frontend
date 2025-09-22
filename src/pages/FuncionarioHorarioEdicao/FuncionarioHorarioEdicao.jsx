import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // CORRIGIDO: importação
import styles from '../FuncionarioHorarioCadastro/FuncionarioHorarioCadastro.module.css'; // Reutilizando estilos
import api from '../../services/api';
import Modal from '../../components/Modal/Modal';

function FuncionarioHorarioEdicao() {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o ID do horário da URL

  const [formData, setFormData] = useState({});
  const [employees, setEmployees] = useState([]);
  const [dayTypeOptions, setDayTypeOptions] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ isOpen: false, message: '', isError: false });

  // Busca os dados do horário, a lista de funcionários e os tipos de dia
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scheduleRes, employeesRes, dayTypesRes] = await Promise.all([
          api.get(`/employeesWorkdays/${id}`), // Endpoint correto para buscar um horário
          api.get('/employees', { params: { PageSize: 1000 } }),
          api.get('/employeesWorkdays/daysTypes')
        ]);
        
        setEmployees(employeesRes.data.value.items || []);
        setDayTypeOptions(dayTypesRes.data.value || []);

        const scheduleData = scheduleRes.data.value;
        
        // Garante que o estado tenha todos os campos necessários para o formulário
        setFormData({
            employeeId: scheduleData.employeeId,
            dayType: scheduleData.dayType.toString(), // Converte para string para o select
            startTime: scheduleData.startTime,
            endTime: scheduleData.endTime,
            employeeName: scheduleData.employeeName, // Guardamos para exibir o nome
        });

      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setFeedback({ isOpen: true, message: "Não foi possível carregar os dados para edição.", isError: true });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Monta o payload EXATAMENTE como a API espera
    const updatePayload = {
      id: parseInt(id, 10),
      startTime: formData.startTime,
      endTime: formData.endTime,
    };
    
    try {
      await api.put(`/employeesWorkdays/${id}`, updatePayload); 
      setFeedback({ isOpen: true, message: 'Horário atualizado com sucesso!', isError: false });
    // CORRIGIDO: Fechamento do bloco try/catch
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
        <h1>Editar Horário de: {formData.employeeName || '...'}</h1>
        <button onClick={() => navigate('/funcionario-horario')} className={styles.backButton}>
          Voltar para a Lista
        </button>
      </div>
      
      <form className={styles.form} onSubmit={handleUpdate}>
        <div className={styles.formGrid}>
          {/* O campo funcionário agora é apenas informativo (não editável) */}
          <div className={styles.inputGroup}>
            <label htmlFor="employeeId">Funcionário</label>
            <input 
              name="employeeId" 
              type="text" 
              value={formData.employeeName || ''} 
              readOnly 
              className={styles.readOnlyInput} 
            />
          </div>

          {/* O tipo de dia também não é editável, conforme o payload de atualização */}
          <div className={styles.inputGroup}>
            <label htmlFor="dayType">Tipo de Dia</label>
            <select name="dayType" value={formData.dayType || ''} onChange={handleChange} disabled>
              <option value="">Selecione o tipo...</option>
              {dayTypeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.name}</option>
              ))}
            </select>
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
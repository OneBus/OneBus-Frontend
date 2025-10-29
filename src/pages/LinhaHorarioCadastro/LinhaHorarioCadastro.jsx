import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LinhaHorarioCadastro.module.css';
import api from '../../services/api';
import Modal from '../../components/Modal/Modal';
import { FaInfoCircle } from 'react-icons/fa'; // Importe o ícone se for usar InfoTooltip

// Componente para o asterisco vermelho com tooltip
const RequiredIndicator = () => (
  <span className={styles.requiredTooltip} data-tooltip="Campo obrigatório">
    *
  </span>
);

function LinhaHorarioCadastro() {
  const navigate = useNavigate();

  // Estado alinhado com a API
  const [formData, setFormData] = useState({
    lineId: '',
    directionType: '',
    time: '',
    dayType: '',
  });

  // Estados para popular os menus
  const [lineOptions, setLineOptions] = useState([]);
  const [directionTypeOptions, setDirectionTypeOptions] = useState([]);
  const [dayTypeOptions, setDayTypeOptions] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ isOpen: false, message: '', isError: false });
  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState({}); // Adicionado estado de erros

  // Busca as opções para os menus da API
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Busca todas as listas necessárias em paralelo
        const [linesRes, directionsRes, dayTypesRes] = await Promise.all([
          api.get('/lines', { params: { PageSize: 1000 } }), // Busca todas as linhas
          api.get('/lines/directionTypes'),
          // Assumindo endpoint similar ao de funcionários para os tipos de dia
          api.get('/employeesWorkdays/daysTypes'), 
        ]);
        setLineOptions(linesRes.data.value.items || []);
        setDirectionTypeOptions(directionsRes.data.value || []);
        setDayTypeOptions(dayTypesRes.data.value || []);
      } catch (err) {
        console.error("Erro ao carregar opções do formulário:", err);
        setFeedback({ isOpen: true, message: "Não foi possível carregar os dados necessários.", isError: true });
      }
    };
    fetchOptions();
  }, []);

  // Validação em tempo real
  useEffect(() => {
    const requiredFields = ['lineId', 'directionType', 'time', 'dayType'];
    const allRequiredFilled = requiredFields.every(field => formData[field] && formData[field].toString().trim() !== '');
    setIsFormValid(allRequiredFilled);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
        setFeedback({ isOpen: true, message: "Preencha todos os campos obrigatórios.", isError: true });
        return;
    }
    setLoading(true);

    // Prepara o payload para a API
    const payload = {
      lineId: parseInt(formData.lineId, 10),
      directionType: parseInt(formData.directionType, 10),
      time: formData.time,
      dayType: parseInt(formData.dayType, 10),
    };
    
    try {
      await api.post('/linesTimes', payload);
      setFeedback({ isOpen: true, message: 'Horário da linha cadastrado com sucesso!', isError: false });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao cadastrar o horário da linha.';
      setFeedback({ isOpen: true, message: errorMessage, isError: true });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseModal = () => {
    setFeedback({ isOpen: false, message: '', isError: false });
    if (!feedback.isError) navigate('/linha-horario');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Cadastrar Horário da Linha</h1>
        <button onClick={() => navigate('/linha-horario')} className={styles.backButton}>
          Voltar para a Lista
        </button>
      </div>
      
      <form className={styles.form} onSubmit={handleSave} noValidate>
        <div className={styles.formGrid}>
          {/* Campo Linha */}
          <div className={styles.inputGroup}>
            <label htmlFor="lineId">Linha <RequiredIndicator /></label>
            <select name="lineId" id="lineId" value={formData.lineId} onChange={handleChange} required>
              <option value="">Selecione a linha...</option>
              {lineOptions.map(line => (
                // Usamos line.id e line.name (verifique se a API de linhas retorna 'name')
                <option key={line.id} value={line.id}>{line.number} - {line.name}</option> 
              ))}
            </select>
          </div>

          {/* Campo Sentido */}
          <div className={styles.inputGroup}>
            <label htmlFor="directionType">Sentido <RequiredIndicator /></label>
            <select name="directionType" id="directionType" value={formData.directionType} onChange={handleChange} required>
              <option value="">Selecione...</option>
              {directionTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
            </select>
          </div>

          {/* Campo Hora Viagem (renomeado de horaInicio para time) */}
          <div className={styles.inputGroup}>
            <label htmlFor="time">Hora Viagem <RequiredIndicator /></label>
            <input name="time" id="time" type="time" value={formData.time} onChange={handleChange} required />
          </div>

          {/* Campo Dia (renomeado de dia para dayType) */}
          <div className={styles.inputGroup}>
            <label htmlFor="dayType">Dia de Operação <RequiredIndicator /></label>
            <select name="dayType" id="dayType" value={formData.dayType} onChange={handleChange} required>
              <option value="">Selecione...</option>
              {dayTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
            </select>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.saveButton} disabled={!isFormValid || loading}>
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

export default LinhaHorarioCadastro;
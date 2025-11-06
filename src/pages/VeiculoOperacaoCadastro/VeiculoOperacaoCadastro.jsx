import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './VeiculoOperacaoCadastro.module.css';
import api from '../../services/api';
import Modal from '../../components/Modal/Modal';

// Componente para o asterisco vermelho
const RequiredIndicator = () => (
  <span className={styles.requiredTooltip} data-tooltip="Campo obrigatório">
    *
  </span>
);

function VeiculoOperacaoCadastro() {
  const navigate = useNavigate();

  // Estado alinhado com a API: lineTimeId, employeeWorkdayId, vehicleId
  const [formData, setFormData] = useState({
    lineTimeId: '',
    employeeWorkdayId: '',
    vehicleId: '',
  });

  // Estados para popular os menus de seleção
  const [lineTimeOptions, setLineTimeOptions] = useState([]);
  const [employeeWorkdayOptions, setEmployeeWorkdayOptions] = useState([]);
  const [vehicleOptions, setVehicleOptions] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ isOpen: false, message: '', isError: false });
  const [isFormValid, setIsFormValid] = useState(false);

  // Busca os dados para popular todos os menus
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [linesTimesRes, employeeWorkdaysRes, vehiclesRes] = await Promise.all([
          api.get('/linesTimes', { params: { PageSize: 1000 } }), // Busca todos os horários de linha
          api.get('/employeesWorkdays', { params: { PageSize: 1000 } }), // Busca todos os horários de funcionário
          api.get('/vehicles', { params: { PageSize: 1000 } }), // Busca todos os veículos
        ]);
        
        setLineTimeOptions(linesTimesRes.data.value.items || []);
        setEmployeeWorkdayOptions(employeeWorkdaysRes.data.value.items || []);
        setVehicleOptions(vehiclesRes.data.value.items || []);
      } catch (err) {
        console.error("Erro ao carregar dados do formulário:", err);
        setFeedback({ isOpen: true, message: "Não foi possível carregar os dados necessários.", isError: true });
      }
    };
    fetchOptions();
  }, []);

  // Validação em tempo real
  useEffect(() => {
    const { lineTimeId, employeeWorkdayId, vehicleId } = formData;
    const allRequiredFilled = lineTimeId && employeeWorkdayId && vehicleId;
    setIsFormValid(allRequiredFilled);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setFeedback({ isOpen: true, message: 'Todos os campos são obrigatórios.', isError: true });
      return;
    }
    setLoading(true);

    // Prepara o payload para a API
    const payload = {
      lineTimeId: parseInt(formData.lineTimeId, 10),
      employeeWorkdayId: parseInt(formData.employeeWorkdayId, 10),
      vehicleId: parseInt(formData.vehicleId, 10),
    };
    
    try {
      await api.post('/vehiclesOperations', payload);
      setFeedback({ isOpen: true, message: 'Operação alocada com sucesso!', isError: false });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao alocar a operação.';
      setFeedback({ isOpen: true, message: errorMessage, isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setFeedback({ isOpen: false, message: '', isError: false });
    if (!feedback.isError) navigate('/veiculo-operacao');
  };

  // Funções auxiliares para formatar opções dos selects
  const formatTime = (time) => new Date(`1970-01-01T${time}`).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Criar Nova Operação</h1>
        <button onClick={() => navigate('/veiculo-operacao')} className={styles.backButton}>
          Voltar para a Lista
        </button>
      </div>
      
      <form className={styles.form} onSubmit={handleSave} noValidate>
        <div className={styles.formGrid}>
          {/* Campo Horário da Linha */}
          <div className={styles.inputGroup}>
            <label htmlFor="lineTimeId">Horário da Linha <RequiredIndicator /></label>
            <select name="lineTimeId" id="lineTimeId" value={formData.lineTimeId} onChange={handleChange} required>
              <option value="">Selecione o horário da linha...</option>
              {lineTimeOptions.map(lt => (
                <option key={lt.id} value={lt.id}>
                  {`Linha ${lt.lineNumber} (${lt.lineName}) - ${formatTime(lt.time)} (${lt.dayTypeName})`}
                </option>
              ))}
            </select>
          </div>

          {/* Campo Horário do Funcionário */}
          <div className={styles.inputGroup}>
            <label htmlFor="employeeWorkdayId">Horário do Funcionário <RequiredIndicator /></label>
            <select name="employeeWorkdayId" id="employeeWorkdayId" value={formData.employeeWorkdayId} onChange={handleChange} required>
              <option value="">Selecione o horário do funcionário...</option>
              {employeeWorkdayOptions.map(ew => (
                <option key={ew.id} value={ew.id}>
                  {`${ew.employeeName} - ${formatTime(ew.startTime)} às ${formatTime(ew.endTime)} (${ew.dayTypeName})`}
                </option>
              ))}
            </select>
          </div>

          {/* Campo Veículo */}
          <div className={styles.inputGroup}>
            <label htmlFor="vehicleId">Veículo <RequiredIndicator /></label>
            <select name="vehicleId" id="vehicleId" value={formData.vehicleId} onChange={handleChange} required>
              <option value="">Selecione o veículo...</option>
              {vehicleOptions.map(veh => (
                <option key={veh.id} value={veh.id}>{veh.prefix} - {veh.model}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.saveButton} disabled={!isFormValid || loading}>
            {loading ? 'Salvando...' : 'Salvar Alocação'}
          </button>
        </div>
      </form>
      <Modal isOpen={feedback.isOpen} onClose={handleCloseModal}>
        {/* ... (código do modal) ... */} 
          <div className="feedback-modal-content">
          <h3>{feedback.isError ? 'Ocorreu um Erro' : 'Sucesso!'}</h3>
          <p>{feedback.message}</p>
          <button onClick={handleCloseModal} className="feedback-modal-button">Fechar</button>
        </div>
  
      </Modal>
    </div>
  );
}

export default VeiculoOperacaoCadastro;
     

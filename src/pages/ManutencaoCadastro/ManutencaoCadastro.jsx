import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ManutencaoCadastro.module.css';
import api from '../../services/api';
import Modal from '../../components/Modal/Modal';
import { FaInfoCircle } from 'react-icons/fa'; // Importe se usar InfoTooltip

// Componente para o asterisco vermelho com tooltip
const RequiredIndicator = () => (
  <span className={styles.requiredTooltip} data-tooltip="Campo obrigatório">
    *
  </span>
);

function ManutencaoCadastro() {
  const navigate = useNavigate();

  // Estado alinhado com a API
  const [formData, setFormData] = useState({
    vehicleId: '',
    sector: '',
    description: '',
    startDate: '',
    endDate: '',
    surveyExpiration: '',
    // cost: 0, // Adicione se o custo for um campo do formulário
  });

  // Estados para popular os menus
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [sectorOptions, setSectorOptions] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ isOpen: false, message: '', isError: false });
  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState({}); // Adicionado para futuras validações

  // Busca as opções para os menus da API
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [vehiclesRes, sectorsRes] = await Promise.all([
          // Busca todos os veículos para o select
          api.get('/vehicles', { params: { PageSize: 1000 } }), 
          // Endpoint para buscar os setores
          api.get('/maintenances/sectors'), 
        ]);
        setVehicleOptions(vehiclesRes.data.value.items || []);
        setSectorOptions(sectorsRes.data.value || []);
      } catch (err) {
        console.error("Erro ao carregar opções do formulário:", err);
        setFeedback({ isOpen: true, message: "Não foi possível carregar os dados necessários.", isError: true });
      }
    };
    fetchOptions();
  }, []);

  // Validação em tempo real para habilitar/desabilitar o botão
  useEffect(() => {
    // Define quais campos são obrigatórios
    const requiredFields = ['vehicleId', 'sector', 'description', 'startDate'];
    const allRequiredFilled = requiredFields.every(field => formData[field] && formData[field].toString().trim() !== '');
    
    // Atualiza o estado de validade (adicionaremos a verificação de erros se necessário)
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
      vehicleId: parseInt(formData.vehicleId, 10),
      sector: parseInt(formData.sector, 10),
      description: formData.description,
      startDate: formData.startDate,
      // Envia null se as datas opcionais não forem preenchidas
      endDate: formData.endDate || null, 
      surveyExpiration: formData.surveyExpiration || null,
      // cost: formData.cost ? parseFloat(formData.cost) : 0, // Se tiver campo de custo
    };
    
    try {
      await api.post('/maintenances', payload);
      setFeedback({ isOpen: true, message: 'Manutenção agendada com sucesso!', isError: false });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao agendar a manutenção.';
      setFeedback({ isOpen: true, message: errorMessage, isError: true });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseModal = () => {
    setFeedback({ isOpen: false, message: '', isError: false });
    if (!feedback.isError) navigate('/manutencao');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Agendar Nova Manutenção</h1>
        <button onClick={() => navigate('/manutencao')} className={styles.backButton}>
          Voltar para a Lista
        </button>
      </div>
      
      <form className={styles.form} onSubmit={handleSave} noValidate>
        <div className={styles.formGrid}>
          {/* Campo Prefixo/Veículo */}
          <div className={styles.inputGroup}>
            <label htmlFor="vehicleId">Veículo (Prefixo) <RequiredIndicator /></label>
            <select name="vehicleId" id="vehicleId" value={formData.vehicleId} onChange={handleChange} required>
              <option value="">Selecione o veículo...</option>
              {vehicleOptions.map(vehicle => (
                // Guarda o ID, mas mostra o prefixo para o usuário
                <option key={vehicle.id} value={vehicle.id}>{vehicle.prefix}</option> 
              ))}
            </select>
          </div>

          {/* Campo Setor */}
          <div className={styles.inputGroup}>
            <label htmlFor="sector">Setor <RequiredIndicator /></label>
            <select name="sector" id="sector" value={formData.sector} onChange={handleChange} required>
              <option value="">Selecione...</option>
              {sectorOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
            </select>
          </div>

          {/* Campo Data Início */}
          <div className={styles.inputGroup}>
            <label htmlFor="startDate">Data e Hora de Início <RequiredIndicator /></label>
            <input name="startDate" id="startDate" type="datetime-local" value={formData.startDate} onChange={handleChange} required />
          </div>

          {/* Campo Data Término (Opcional) */}
          <div className={styles.inputGroup}>
            <label htmlFor="endDate">Data e Hora de Término</label>
            <input name="endDate" id="endDate" type="datetime-local" value={formData.endDate} onChange={handleChange} />
          </div>
          
          {/* Campo Vencimento da Vistoria (Opcional) */}
          <div className={styles.inputGroup}>
            <label htmlFor="surveyExpiration">Vencimento da Vistoria</label>
            <input name="surveyExpiration" id="surveyExpiration" type="date" value={formData.surveyExpiration} onChange={handleChange} />
          </div>

          {/* Campo Descrição */}
          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label htmlFor="description">Descrição do Serviço <RequiredIndicator /></label>
            <textarea name="description" id="description" rows="4" placeholder="Descreva o serviço a ser realizado..." value={formData.description} onChange={handleChange} required></textarea>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.saveButton} disabled={!isFormValid || loading}>
            {loading ? 'Salvando...' : 'Salvar Agendamento'}
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

export default ManutencaoCadastro;
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

  // CORRIGIDO: Nomes alinhados com a API
  const [formData, setFormData] = useState({
    vehicleId: '',
    sector: '',
    description: '',
    startDate: '',
    endDate: '',
    surveyExpiration: '',
    cost: '', // ADICIONADO: Campo de custo
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
    const requiredFields = ['vehicleId', 'sector', 'description', 'startDate'];
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

    // CORRIGIDO: Payload alinhado com a API e nomes do estado
    const payload = {
      vehicleId: parseInt(formData.vehicleId, 10),
      sector: parseInt(formData.sector, 10),
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate || null, 
      surveyExpiration: formData.surveyExpiration || null,
      cost: formData.cost ? parseFloat(formData.cost) : 0, // ADICIONADO: Envia 0 se vazio
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
          {/* CORRIGIDO: 'name' agora é 'vehicleId' */}
          <div className={styles.inputGroup}>
            <label htmlFor="vehicleId">Veículo (Prefixo) <RequiredIndicator /></label>
            <select name="vehicleId" id="vehicleId" value={formData.vehicleId} onChange={handleChange} required>
              <option value="">Selecione o veículo...</option>
              {vehicleOptions.map(vehicle => (
                <option key={vehicle.id} value={vehicle.id}>{vehicle.prefix}</option> 
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="sector">Setor <RequiredIndicator /></label>
            <select name="sector" id="sector" value={formData.sector} onChange={handleChange} required>
              <option value="">Selecione...</option>
              {sectorOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
            </select>
          </div>

          {/* CORRIGIDO: 'name' e 'type' alterados */}
          <div className={styles.inputGroup}>
            <label htmlFor="startDate">Data de Início <RequiredIndicator /></label>
            <input name="startDate" id="startDate" type="date" value={formData.startDate} onChange={handleChange} required />
          </div>

          {/* CORRIGIDO: 'name' e 'type' alterados */}
          <div className={styles.inputGroup}>
            <label htmlFor="endDate">Data de Término</label>
            <input name="endDate" id="endDate" type="date" value={formData.endDate} onChange={handleChange} />
          </div>
          
          {/* CORRIGIDO: 'name' alterado */}
          <div className={styles.inputGroup}>
            <label htmlFor="surveyExpiration">Vencimento da Vistoria</label>
            <input name="surveyExpiration" id="surveyExpiration" type="date" value={formData.surveyExpiration} onChange={handleChange} />
          </div>

          {/* ADICIONADO: Novo campo de Custo */}
          <div className={styles.inputGroup}>
            <label htmlFor="cost">Custo (R$)</label>
            <input name="cost" id="cost" type="number" step="0.01" placeholder="0.00" value={formData.cost} onChange={handleChange} />
          </div>

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
        
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ManutencaoEdicao.module.css';
import api from '../../services/api';
import Modal from '../../components/Modal/Modal';
import { FaInfoCircle } from 'react-icons/fa'; // Importe se usar InfoTooltip

// Componente para o asterisco vermelho com tooltip
const RequiredIndicator = () => (
  <span className={styles.requiredTooltip} data-tooltip="Campo obrigatório">
    *
  </span>
);

// Função auxiliar para formatar datetime-local (YYYY-MM-DDTHH:mm)
const formatDateTimeForInput = (dateTimeString) => {
    if (!dateTimeString) return '';
    try {
        const date = new Date(dateTimeString);
        // Ajusta para o fuso horário local antes de formatar
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return date.toISOString().slice(0, 16);
    } catch (e) {
        return '';
    }
};

// Função auxiliar para formatar date (YYYY-MM-DD)
const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString + 'T00:00:00'); // Garante que a data seja interpretada corretamente
        return date.toISOString().slice(0, 10);
    } catch (e) {
        return '';
    }
};


function ManutencaoEdicao() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [originalFormData, setOriginalFormData] = useState({});
  const [formData, setFormData] = useState({});
  
  // Estados para popular os menus
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [sectorOptions, setSectorOptions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ isOpen: false, message: '', isError: false });
  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState({}); // Para futuras validações

  // Busca os dados da manutenção e as opções para os menus
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [maintenanceRes, vehiclesRes, sectorsRes] = await Promise.all([
          api.get(`/maintenances/${id}`), // Busca a manutenção específica
          api.get('/vehicles', { params: { PageSize: 1000 } }), 
          api.get('/maintenances/sectors'), 
        ]);

        setVehicleOptions(vehiclesRes.data.value.items || []);
        setSectorOptions(sectorsRes.data.value || []);

        const maintenanceData = maintenanceRes.data.value;
        
        // Formata os dados para preencher o formulário corretamente
        const formattedData = {
          ...maintenanceData,
          vehicleId: maintenanceData.vehicleId.toString(),
          sector: maintenanceData.sector.toString(),
          startDate: formatDateTimeForInput(maintenanceData.startDate),
          endDate: formatDateTimeForInput(maintenanceData.endDate),
          surveyExpiration: formatDateForInput(maintenanceData.surveyExpiration),
        };

        setFormData(formattedData);
        setOriginalFormData(formattedData); // Guarda os dados originais

      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setFeedback({ isOpen: true, message: "Não foi possível carregar os dados para edição.", isError: true });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Validação em tempo real
  useEffect(() => {
    const requiredFields = ['vehicleId', 'sector', 'description', 'startDate'];
    const allRequiredFilled = requiredFields.every(field => formData[field] && formData[field].toString().trim() !== '');
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalFormData);
    const noErrors = Object.keys(errors).length === 0;
    
    setIsFormValid(allRequiredFilled && hasChanges && noErrors);
  }, [formData, originalFormData, errors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
        setFeedback({ isOpen: true, message: "Nenhuma alteração foi feita ou um campo obrigatório está vazio.", isError: true });
        return;
    }
    setLoading(true);

    // Prepara o payload para a API
    const payload = {
      id: parseInt(id, 10),
      vehicleId: parseInt(formData.vehicleId, 10),
      sector: parseInt(formData.sector, 10),
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate || null, 
      surveyExpiration: formData.surveyExpiration || null,
      // cost: formData.cost ? parseFloat(formData.cost) : undefined, // Envia custo se existir
    };
    
    try {
      await api.put(`/maintenances/${id}`, payload);
      setFeedback({ isOpen: true, message: 'Manutenção atualizada com sucesso!', isError: false });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar a manutenção.';
      setFeedback({ isOpen: true, message: errorMessage, isError: true });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseModal = () => {
    setFeedback({ isOpen: false, message: '', isError: false });
    if (!feedback.isError) navigate('/manutencao');
  };

  if (loading) return <p className={styles.container}>Carregando dados da manutenção...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Editar Agendamento</h1>
        <button onClick={() => navigate('/manutencao')} className={styles.backButton}>
          Voltar para a Lista
        </button>
      </div>
      
      <form className={styles.form} onSubmit={handleUpdate} noValidate>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label htmlFor="vehicleId">Veículo (Prefixo) <RequiredIndicator /></label>
            <select name="vehicleId" id="vehicleId" value={formData.vehicleId ?? ''} onChange={handleChange} required>
              <option value="">Selecione...</option>
              {vehicleOptions.map(vehicle => (
                <option key={vehicle.id} value={vehicle.id}>{vehicle.prefix}</option> 
              ))}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="sector">Setor <RequiredIndicator /></label>
            <select name="sector" id="sector" value={formData.sector ?? ''} onChange={handleChange} required>
              <option value="">Selecione...</option>
              {sectorOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="startDate">Data e Hora de Início <RequiredIndicator /></label>
            <input name="startDate" id="startDate" type="datetime-local" value={formData.startDate || ''} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="endDate">Data e Hora de Término</label>
            <input name="endDate" id="endDate" type="datetime-local" value={formData.endDate || ''} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="surveyExpiration">Vencimento da Vistoria</label>
            <input name="surveyExpiration" id="surveyExpiration" type="date" value={formData.surveyExpiration || ''} onChange={handleChange} />
          </div>
          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label htmlFor="description">Descrição do Serviço <RequiredIndicator /></label>
            <textarea name="description" id="description" rows="4" value={formData.description || ''} onChange={handleChange} required></textarea>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.saveButton} disabled={!isFormValid || loading}>
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

export default ManutencaoEdicao;
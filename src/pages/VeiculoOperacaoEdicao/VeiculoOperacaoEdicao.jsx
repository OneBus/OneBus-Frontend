import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './VeiculoOperacaoEdicao.module.css'; // Reutilizando o CSS
import api from '../../services/api';
import Modal from '../../components/Modal/Modal';
import { FaInfoCircle } from 'react-icons/fa'; // Importe o ícone se for usar o InfoTooltip

// Componente para o asterisco vermelho
const RequiredIndicator = () => (
  <span className={styles.requiredTooltip} data-tooltip="Campo obrigatório">
    *
  </span>
);

function VeiculoOperacaoEdicao() {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o ID da operação da URL

  // Estado para os dados do formulário
  const [formData, setFormData] = useState({});
  // Estado para guardar os dados originais e verificar se houve mudanças
  const [originalFormData, setOriginalFormData] = useState({});
  
  // Estados para popular os menus de seleção
  const [lineTimeOptions, setLineTimeOptions] = useState([]);
  const [employeeWorkdayOptions, setEmployeeWorkdayOptions] = useState([]);
  const [vehicleOptions, setVehicleOptions] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ isOpen: false, message: '', isError: false });
  const [isFormValid, setIsFormValid] = useState(false);

  // Busca os dados da operação específica E as opções para os menus
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [operationRes, linesTimesRes, employeeWorkdaysRes, vehiclesRes] = await Promise.all([
          api.get(`/vehiclesOperations/${id}`), // 1. Busca a operação específica
          api.get('/linesTimes', { params: { PageSize: 1000 } }),
          api.get('/employeesWorkdays', { params: { PageSize: 1000 } }),
          api.get('/vehicles', { params: { PageSize: 1000 } }),
        ]);
        
        // 2. Popula os menus de seleção
        setLineTimeOptions(linesTimesRes.data.value.items || []);
        setEmployeeWorkdayOptions(employeeWorkdaysRes.data.value.items || []);
        setVehicleOptions(vehiclesRes.data.value.items || []);

        // 3. Preenche o formulário com os dados da operação
        const operationData = operationRes.data.value;
        const formattedData = {
          lineTimeId: operationData.lineTimeId.toString(),
          employeeWorkdayId: operationData.employeeWorkdayId.toString(),
          vehicleId: operationData.vehicleId.toString(),
        };
        
        setFormData(formattedData);
        setOriginalFormData(formattedData); // 4. Salva os dados originais

      } catch (err) {
        console.error("Erro ao carregar dados para edição:", err);
        setFeedback({ isOpen: true, message: "Não foi possível carregar os dados para edição.", isError: true });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Validação em tempo real (habilita o botão se houver mudanças e tudo estiver preenchido)
  useEffect(() => {
    const { lineTimeId, employeeWorkdayId, vehicleId } = formData;
    const allRequiredFilled = lineTimeId && employeeWorkdayId && vehicleId;
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalFormData);
    
    setIsFormValid(allRequiredFilled && hasChanges);
  }, [formData, originalFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setFeedback({ isOpen: true, message: 'Nenhuma alteração foi feita ou um campo obrigatório está vazio.', isError: true });
      return;
    }
    setLoading(true);

    // Prepara o payload para a API (com o ID da operação)
    const payload = {
      id: parseInt(id, 10),
      lineTimeId: parseInt(formData.lineTimeId, 10),
      employeeWorkdayId: parseInt(formData.employeeWorkdayId, 10),
      vehicleId: parseInt(formData.vehicleId, 10),
    };
    
    try {
      await api.put(`/vehiclesOperations/${id}`, payload);
      setFeedback({ isOpen: true, message: 'Operação atualizada com sucesso!', isError: false });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar a operação.';
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

  if (loading) return <p className={styles.container}>Carregando dados da operação...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Editar Operação</h1>
        <button onClick={() => navigate('/veiculo-operacao')} className={styles.backButton}>
          Voltar para a Lista
        </button>
      </div>
      
      <form className={styles.form} onSubmit={handleUpdate} noValidate>
        <div className={styles.formGrid}>
          {/* Campo Horário da Linha */}
          <div className={styles.inputGroup}>
            <label htmlFor="lineTimeId">Horário da Linha <RequiredIndicator /></label>
            <select name="lineTimeId" id="lineTimeId" value={formData.lineTimeId ?? ''} onChange={handleChange} required>
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
            <select name="employeeWorkdayId" id="employeeWorkdayId" value={formData.employeeWorkdayId ?? ''} onChange={handleChange} required>
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
            <select name="vehicleId" id="vehicleId" value={formData.vehicleId ?? ''} onChange={handleChange} required>
              <option value="">Selecione o veículo...</option>
              {vehicleOptions.map(veh => (
                <option key={veh.id} value={veh.id}>{veh.prefix} - {veh.model}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.saveButton} disabled={!isFormValid || loading}>
            {loading ? 'Salvando...' : 'Salvar Alterações'}
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

export default VeiculoOperacaoEdicao;
       
 
import React, { useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './LinhaEdicao.module.css';
import api from '../../services/api';
import Modal from '../../components/Modal/Modal';


const RequiredIndicator = () => (
  <span className={styles.requiredTooltip} data-tooltip="Campo obrigatório">
    *
  </span>
);
const InfoTooltip = ({ text }) => (
  <span className={styles.infoTooltip} data-tooltip={text}>
 ⓘ
  </span>
);

function LinhaEdicao() {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o ID da URL

  const [originalFormData, setOriginalFormData] = useState({});
  const [formData, setFormData] = useState({});
  // Estados para popular os menus
  const [typeOptions, setTypeOptions] = useState([]);
  const [directionTypeOptions, setDirectionTypeOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ isOpen: false, message: '', isError: false });

  const[errors, setErrors] = useState({});//handleblur pode usar ela
  const[isFormValid, setIsFormValid] = useState (false); //default false because form is empty

  // Busca os dados da linha e as opções para os menus
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lineRes, typesRes, directionsRes] = await Promise.all([
          api.get(`/lines/${id}`), // Busca a linha específica
          api.get('/lines/types'),
          api.get('/lines/directionTypes'),
        ]);

        // Popula os menus
        setTypeOptions(typesRes.data.value || []);
        setDirectionTypeOptions(directionsRes.data.value || []);

        // Preenche o formulário com os dados da linha
        const lineData = lineRes.data.value;
        setFormData(lineData);
        setOriginalFormData(lineData); // Guarda os dados originais para comparação

      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setFeedback({ isOpen: true, message: "Não foi possível carregar os dados para edição.", isError: true });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);


//useEffect(() => {
  // Verifica se todos os campos obrigatórios estão preenchidos
 // const isValid = formData.number && formData.name && formData.type && formData.travelTime && formData.mileage && formData.directionType;
  //setIsFormValid(!isValid); // Desabilita o botão se o formulário não for válido}, [formData]);

//  useEffect(() => {
  //   const requiredFields = [
        //  'number', 'name', 'type', 'travelTime', 'mileage', 'directionType'
         
       // ];
    
        // Verifica se todos os campos obrigatórios estão preenchidos e se não há erros
      //  const allRequiredFilled = requiredFields.every(field => formData[field] && formData[field].toString().trim() !== '');
       // const noErrors = Object.keys(errors).length === 0;
        //atualiza o estado de validação do formulário
      ///  setIsFormValid(allRequiredFilled && noErrors);
     // }, [formData, errors]);
  



       useEffect(() => {
    // 1. Verifica se todos os campos obrigatórios continuam preenchidos
    const requiredFields = [
      'number', 'name', 'type', 'travelTime', 'mileage'
    ];
   const allRequiredFilled = requiredFields.every(field => 
      formData[field] !== null && 
      formData[field] !== undefined && 
      formData[field].toString().trim() !== ''
    );

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
      setFeedback({ isOpen: true, message: 'Nenhuma alteração foi feita ou um campo obrigatório está vazio.', isError: true });
      return;
    }
    setLoading(true);

    // Prepara o payload para a API, alinhado com o que o PUT espera
    const payload = {
      id: parseInt(id, 10),
      number: formData.number,
      name: formData.name,
      type: parseInt(formData.type, 10),
      travelTime: formData.travelTime || null,
      mileage: formData.mileage ? parseFloat(formData.mileage) : null,
      directionType: parseInt(formData.directionType, 10),
    };
    
    try {
      await api.put(`/lines/${id}`, payload);
      setFeedback({ isOpen: true, message: 'Linha atualizada com sucesso!', isError: false });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar a linha.';
      setFeedback({ isOpen: true, message: errorMessage, isError: true });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseModal = () => {
    setFeedback({ isOpen: false, message: '', isError: false });
    if (!feedback.isError) navigate('/linha');
  };

  if (loading) return <p className={styles.container}>Carregando dados da linha...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Editar Linha: {formData.number || '...'}</h1>
        <button onClick={() => navigate('/linha')} className={styles.backButton}>
          Voltar para a Lista
        </button>
      </div>
      
      <form className={styles.form} onSubmit={handleUpdate} noValidate>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label htmlFor="number">Número da Linha <RequiredIndicator /></label>
            <input name="number" id="number" type="text" value={formData.number || ''} onChange={handleChange} maxLength="11" required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Nome da Linha <RequiredIndicator /></label>
            <input name="name" id="name" type="text" value={formData.name || ''} onChange={handleChange} maxLength="64" required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="type">Tipo <RequiredIndicator /></label>
            <select name="type" id="type" value={formData.type ?? ''} onChange={handleChange} required>
              <option value="">Selecione...</option>
              {typeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="travelTime">Tempo de Viagem <RequiredIndicator />
             <InfoTooltip text="Tempo de viagem dado em horas. Ex: 01:30 (1 hora e meia)" />
            </label>
            <input name="travelTime" id="travelTime" type="time" value={formData.travelTime || ''} maxLength="8" onChange={handleChange} required/>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="mileage">Quilometragem (KM) <RequiredIndicator /></label>
            <input name="mileage" id="mileage" type="text" value={formData.mileage || ''} onChange={handleChange} maxLength="12" required/>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="directionType">Sentido <RequiredIndicator /></label>
            <select name="directionType" id="directionType" value={formData.directionType ?? ''} onChange={handleChange} required>
              <option value="">Selecione...</option>
              {directionTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
            </select>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.saveButton} disabled={ !isFormValid || loading}>
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

export default LinhaEdicao;
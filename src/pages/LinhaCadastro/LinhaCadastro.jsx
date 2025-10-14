import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LinhaCadastro.module.css';
import api from '../../services/api';
import Modal from '../../components/Modal/Modal';



const RequiredIndicator = () => (
  <span className={styles.requiredTooltip} data-tooltip="Campo obrigatório">
    *
  </span>
);

// Componente para o 'i' verde com tooltip de informação
const InfoTooltip = ({ text }) => (
  <span className={styles.infoTooltip} data-tooltip={text}>
   ⓘ
  </span>
);


function LinhaCadastro() {
  const navigate = useNavigate();

  // Estado alinhado com os campos da API
  const [formData, setFormData] = useState({
    number: '',
    name: '',
    type: '',
    travelTime: '',
    mileage:'', // Assumindo 'km' para quilometragem
    directionType: '',
  });
  
  // Estados para popular os menus
  const [typeOptions, setTypeOptions] = useState([]);
  const [directionTypeOptions, setDirectionTypeOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ isOpen: false, message: '', isError: false });
 //estados para validações
  const[errors] = useState({});
  const[isFormValid, setIsFormValid] = useState (false); //default false because form is empty


  // Busca as opções para os menus da API
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [typesRes, directionsRes] = await Promise.all([
          api.get('/lines/types'),
          api.get('/lines/directionTypes'),
        ]);
        setTypeOptions(typesRes.data.value || []);
        setDirectionTypeOptions(directionsRes.data.value || []);
      } catch (err) {
        console.error("Erro ao carregar opções do formulário:", err);
        setFeedback({ isOpen: true, message: "Não foi possível carregar os dados para o formulário.", isError: true });
      }
    };
    fetchOptions();
  }, []);



 useEffect(() => {
    const requiredFields = [
      'number', 'name', 'type', 'travelTime', 'mileage', 'directionType'
     
    ];

    // Verifica se todos os campos obrigatórios estão preenchidos e se não há erros
    const allRequiredFilled = requiredFields.every(field => formData[field] && formData[field].toString().trim() !== '');
    const noErrors = Object.keys(errors).length === 0;
    //atualiza o estado de validação do formulário
    setIsFormValid(allRequiredFilled && noErrors);
  }, [formData, errors]);

 
 


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
  

    // Validação simples dos campos obrigatórios
    //if (!formData.number || !formData.name || !formData.type || !formData.directionType) {
      //  setFeedback({ isOpen: true, message: "Preencha todos os campos obrigatórios.", isError: true });
      //  setLoading(false);
   // }

   if (!isFormValid) {
        setFeedback({ isOpen: true, message: "Preencha todos os campos obrigatórios.", isError: true });
        return;
    }
    setLoading(true);

    // Prepara o payload para a API, convertendo os IDs para número
    const payload = {
      number: formData.number,
      name: formData.name,
      type: parseInt(formData.type, 10),
      travelTime: formData.travelTime || null,
      mileage: formData.mileage ? parseFloat(formData.mileage) : null,
      directionType: parseInt(formData.directionType, 10),
    };
    
    try {
      await api.post('/lines', payload);
      setFeedback({ isOpen: true, message: 'Linha cadastrada com sucesso!', isError: false });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao cadastrar a linha.';
      setFeedback({ isOpen: true, message: errorMessage, isError: true });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseModal = () => {
    setFeedback({ isOpen: false, message: '', isError: false });
    if (!feedback.isError) navigate('/linha');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Cadastrar Nova Linha</h1>
        <button onClick={() => navigate('/linha')} className={styles.backButton}>
          Voltar para a Lista
        </button>
      </div>
      
      <form className={styles.form} onSubmit={handleSave} noValidate>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label htmlFor="number">Número da Linha <RequiredIndicator /></label>
            <input name="number" id="number" type="text" placeholder="Ex: 082TRO" value={formData.number} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Nome da Linha <RequiredIndicator /></label>
            <input name="name" id="name" type="text" placeholder="Ex: OSASCO - BARUERI" value={formData.name} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="type">Tipo <RequiredIndicator /></label>
            <select name="type" id="type" value={formData.type} onChange={handleChange} required>
              <option value="">Selecione...</option>
              {typeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="travelTime">Tempo de Viagem <RequiredIndicator />
            <InfoTooltip text="Tempo de viagem dado em horas. Ex: 01:30 (1 hora e meia)" />
            </label>
            <input name="travelTime" id="travelTime" type="time" value={formData.travelTime} onChange={handleChange} required/>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="mileage">Quilometragem (KM)<RequiredIndicator /></label>
            <input name="mileage" id="mileage" type="text"  placeholder="Ex: 25,150" value={formData.mileage} onChange={handleChange} required/>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="directionType">Sentido<RequiredIndicator /></label>
            <select name="directionType" id="directionType" value={formData.directionType} onChange={handleChange} required>
              <option value="">Selecione...</option>
              {directionTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
            </select>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.saveButton} disabled={!isFormValid || loading}>
            {loading ? 'Salvando...' : 'Salvar Linha'}
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

export default LinhaCadastro;
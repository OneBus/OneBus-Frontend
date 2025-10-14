 import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './VeiculoCadastro.module.css';
import api from '../../services/api';
import Modal from '../../components/Modal/Modal';
import { getTodayDate } from '../../utils/validators';

// BOA PRÁTICA: Defina componentes auxiliares fora do componente principal
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
function VeiculoCadastro() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: '', prefix: '', numberDoors: '', numberSeats: '', hasAccessibility: true,
    fuelType: '', brand: '', model: '', year: '', plate: '', color: '',
    bodyworkNumber: '', numberChassis: '', axesNumber: '', ipvaExpiration: '',
    licensing: '', renavam: '', transmissionType: '', status: '',
    busServiceType: '', busChassisBrand: '', busChassisModel: '', busChassisYear: '',
    busHasLowFloor: false, busHasLeftDoors: false, busInsuranceExpiration: '', busFumigateExpiration: '',image: null,
  });
  
  // Estados para popular todos os selects
  const [typeOptions, setTypeOptions] = useState([]);
  const [fuelTypeOptions, setFuelTypeOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);
  const [transmissionTypeOptions, setTransmissionTypeOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [serviceTypeOptions, setserviceTypeOptions] = useState([]);
  const [chassisBrandOptions, setChassisBrandOptions] = useState([]); 
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ isOpen: false, message: '', isError: false });






  // Busca todas as opções para os selects da API
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [
          typesRes, fuelTypesRes, brandsRes, colorsRes, 
          transmissionsRes, statusRes, servicesRes,chassisBrandsRes 
        ] = await Promise.all([
          api.get('/vehicles/types'),
          api.get('/vehicles/fuelTypes'),
          api.get('/vehicles/brands'),
          api.get('/vehicles/colors'),
          api.get('/vehicles/transmissionTypes'),
          api.get('/vehicles/status'),
          api.get('/vehicles/serviceTypes'),
          api.get('/vehicles/chassisBrands'),
        ]);
        
        setTypeOptions(typesRes.data.value || []);
        setFuelTypeOptions(fuelTypesRes.data.value || []);
        setBrandOptions(brandsRes.data.value || []);
        setColorOptions(colorsRes.data.value || []);
        setTransmissionTypeOptions(transmissionsRes.data.value || []);
        setStatusOptions(statusRes.data.value || []);
        setserviceTypeOptions(servicesRes.data.value || []);
        setChassisBrandOptions(chassisBrandsRes.data.value || []); 

      } catch (err) {
        console.error("Erro ao carregar opções do formulário:", err.response);
        setFeedback({ isOpen: true, message: "Não foi possível carregar os dados para o formulário.", isError: true });
      }
    };
    fetchOptions();
  }, []);

 useEffect(() => {
    // 1. Define a lista de campos que são sempre obrigatórios
    let requiredFields = [
      'prefix', 'numberDoors', 'numberSeats', 'fuelType', 'brand', 'model', 'year', 'plate',
      'color', 'bodyworkNumber', 'numberChassis', 'axesNumber', 'ipvaExpiration',
      'licensing', 'renavam', 'transmissionType', 'status'
    ];
    
    const typeId = formData.type;
    // IMPORTANTE: Verifique os IDs corretos para os tipos de ônibus na sua API
    const isBusType = ['0', '1', '2'].includes(typeId);

    if (isBusType) {
      // Adiciona os campos específicos se for um tipo de ônibus
      requiredFields.push(
        'hasAccessibility', 'busServiceType', 'busChassisBrand', 'busChassisModel',
        'busChassisYear', 'busHasLowFloor', 'busHasLeftDoors'
      );
    }

    // A validação agora checa a lista dinâmica
    // E para booleanos (radio), verifica se não são 'null'
    const allRequiredFilled = requiredFields.every(field => {
      const value = formData[field];
      if (typeof value === 'boolean') return value !== null;
      return value && value.toString().trim() !== '';
    });
    
    setIsFormValid(allRequiredFilled);
  }, [formData]);




  const handleChange = (e) => {
    const { name, value, type } = e.target;
    // Lógica para radio buttons
    if (type === 'radio') {
      setFormData(prevState => ({ ...prevState, [name]: value === 'true' }));
    } else {
      setFormData(prevState => ({ ...prevState, [name]: value }));
    }
  };



   const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setFormData(prevState => ({ ...prevState, image: null }));
      return;
    }
    // Validações (opcional, mas recomendado)
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      setFormData(prevState => ({ ...prevState, image: base64String }));
    };
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Converte campos de texto para números onde necessário
    const payload = {
      ...formData,
      type: parseInt(formData.type, 10),
      numberDoors: parseInt(formData.numberDoors, 10),
      numberSeats: parseInt(formData.numberSeats, 10),
      fuelType: parseInt(formData.fuelType, 10),
      brand: parseInt(formData.brand, 10),
      year: parseInt(formData.year, 10),
      color: parseInt(formData.color, 10),
      axesNumber: parseInt(formData.axesNumber, 10),
      transmissionType: parseInt(formData.transmissionType, 10),
      status: parseInt(formData.status, 10),
      busChassisYear: formData.busChassisYear ? parseInt(formData.busChassisYear, 10) : null,
      busServiceType: formData.busServiceType ? parseInt(formData.busServiceType, 10) : null,
    };
    console.log("payload enviado para api:",JSON.stringify(payload, null, 2));

    
    try {
      await api.post('/vehicles', payload);
      setFeedback({ isOpen: true, message: 'Veículo cadastrado com sucesso!', isError: false });
    } catch (err) {

      console.error("ERRO AO SALVAR VEÍCULO:", err.response);

      const errorMessage = err.response?.data?.message || 'Erro ao cadastrar o veículo.';
      setFeedback({ isOpen: true, message: errorMessage, isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setFeedback({ isOpen: false, message: '', isError: false });
    if (!feedback.isError) navigate('/veiculo');
  };

  // Lógica para mostrar campos de ônibus
  // Assumindo que os tipos de ônibus/micro-ônibus têm IDs 0, 1, 2
  const showBusFields = ['0', '1', '2'].includes(formData.type);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Cadastrar Novo Veículo</h1>
        <button onClick={() => navigate('/veiculo')} className={styles.backButton}>
          Voltar para a Lista
        </button>
      </div>
      
      <form className={styles.form} onSubmit={handleSave} noValidate>
        <h2 className={styles.sectionTitle}>Informações Gerais</h2>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label>Tipo<RequiredIndicator /></label>
            <select name="type" value={formData.type} onChange={handleChange} required>
              <option value="">Selecione...</option>
              {typeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Prefixo<RequiredIndicator /></label>
            <input name="prefix" type="text" value={formData.prefix} onChange={handleChange} maxLength="16" required />
          </div>
          <div className={styles.inputGroup}>
            <label>Número de Portas<RequiredIndicator /></label>
            <input name="numberDoors" type="text" value={formData.numberDoors} onChange={handleChange}  required/>
          </div>
          <div className={styles.inputGroup}>
            <label>Número de Assentos<RequiredIndicator /></label>
            <input name="numberSeats" type="text" value={formData.numberSeats} onChange={handleChange} maxLength="3" required/>
          </div>
          <div className={styles.inputGroup}>
            <label>Tipo de Combustível<RequiredIndicator /></label>
            <select name="fuelType" value={formData.fuelType} onChange={handleChange} required>
              <option value="">Selecione...</option>
              {fuelTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Marca<RequiredIndicator /></label>
            <select name="brand" value={formData.brand} onChange={handleChange} required>
              <option value="">Selecione...</option>
              {brandOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Modelo<RequiredIndicator /></label>
            <input name="model" type="text" value={formData.model} onChange={handleChange} required/>
          </div>
          <div className={styles.inputGroup}>
            <label>Ano<RequiredIndicator /></label>
            <input name="year" type="text" placeholder="YYYY" value={formData.year} onChange={handleChange} maxLength="4" required />
          </div>
          <div className={styles.inputGroup}>
            <label>Placa<RequiredIndicator /></label>
            <input name="plate" type="text" value={formData.plate} onChange={handleChange} maxLength="12" required/>
          </div>
          <div className={styles.inputGroup}>
            <label>Cor<RequiredIndicator /></label>
            <select name="color" value={formData.color} onChange={handleChange} required>
              <option value="">Selecione...</option>
              {colorOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Número da Carroceria<RequiredIndicator /></label>
            <input name="bodyworkNumber" type="text" value={formData.bodyworkNumber} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label>Número do Chassi<RequiredIndicator /></label>
            <input name="numberChassis" type="text" value={formData.numberChassis} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label>Número de Eixos<RequiredIndicator /></label>
            <input name="axesNumber" type="number" value={formData.axesNumber} onChange={handleChange} maxLength="1" required />
          </div>
          <div className={styles.inputGroup}>
            <label>Vencimento do IPVA<RequiredIndicator /></label>
            <input name="ipvaExpiration" type="date" value={formData.ipvaExpiration} onChange={handleChange} min={getTodayDate()} required />
          </div>
          <div className={styles.inputGroup}>
            <label>Licenciamento<RequiredIndicator /></label>
            <input name="licensing" type="text" value={formData.licensing} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label>Renavam<RequiredIndicator /></label>
            <input name="renavam" type="text" value={formData.renavam} onChange={handleChange} required/>
          </div>
          <div className={styles.inputGroup}>
            <label>Tipo de Transmissão<RequiredIndicator /></label>
            <select name="transmissionType" value={formData.transmissionType} onChange={handleChange} required>
              <option value="">Selecione...</option>
              {transmissionTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Status<RequiredIndicator /></label>
            <select name="status" value={formData.status} onChange={handleChange} required>
                <option value="">Selecione...</option>
                {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
            </select>
          </div>
          <div className={styles.inputGroupRadio}>
            <label>Acessibilidade<RequiredIndicator /></label>
            <div>
              <label><input type="radio" name="hasAccessibility" value="true" checked={formData.hasAccessibility === true} onChange={handleChange} /> Sim</label>
              <label><input type="radio" name="hasAccessibility" value="false" checked={formData.hasAccessibility === false} onChange={handleChange} /> Não</label>
            </div>
          </div>
          <div>
           <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label htmlFor="image">Imagem do Veículo (Opcional)</label>
            <input name="image" type="file" onChange={handleFileChange} accept="image/png, image/jpeg, image/jpg" />
          </div>
        </div>

        </div>

        {/* --- SEÇÃO CONDICIONAL PARA ÔNIBUS/MICRO-ÔNIBUS --- */}
        {showBusFields && (
          <>
            <h2 className={styles.sectionTitle}>Informações Específicas de Ônibus</h2>
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label>Serviço<RequiredIndicator /></label>
                <select name="busServiceType" value={formData.busServiceType} onChange={handleChange} required={showBusFields}>
                  <option value="">Selecione...</option>
                  {serviceTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>Marca do Chassi<RequiredIndicator /></label>
                 <select name="busChassisBrand" value={formData.busChassisBrand} onChange={handleChange}required={showBusFields}>
                  <option value="">Selecione...</option>
                  {chassisBrandOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
                </select>   </div>
              <div className={styles.inputGroup}>
                <label>Modelo do Chassi<RequiredIndicator /></label>
                <input name="busChassisModel" type="text" value={formData.busChassisModel} onChange={handleChange} required={showBusFields} />
              </div>
              <div className={styles.inputGroup}>
                <label>Ano do Chassi<RequiredIndicator /></label>
                <input name="busChassisYear" type="text" placeholder="YYYY" value={formData.busChassisYear} onChange={handleChange} maxLength="4" required={showBusFields} />
              </div>
              <div className={styles.inputGroup}>
                <label>Vencimento do Seguro<RequiredIndicator /></label>
                <input name="busInsuranceExpiration" type="date" value={formData.busInsuranceExpiration} onChange={handleChange} />
              </div>
              <div className={styles.inputGroup}>
                <label>Próxima Detetização<RequiredIndicator /></label>
                <input name="busFumigateExpiration" type="date" value={formData.busFumigateExpiration} onChange={handleChange} />
              </div>
              <div className={styles.inputGroupRadio}>
                <label>Piso Baixo<RequiredIndicator /></label>
                <div>
                  <label><input type="radio" name="busHasLowFloor" value="true" checked={formData.busHasLowFloor === true} onChange={handleChange} required={showBusFields} /> Sim</label>
                  <label><input type="radio" name="busHasLowFloor" value="false" checked={formData.busHasLowFloor === false} onChange={handleChange} required={showBusFields}/> Não</label>
                </div>
              </div>
              <div className={styles.inputGroupRadio}>
                <label>Portas à Esquerda<RequiredIndicator /></label>
                <div>
                  <label><input type="radio" name="busHasLeftDoors" value="true" checked={formData.busHasLeftDoors === true} onChange={handleChange} required={showBusFields} /> Sim</label>
                  <label><input type="radio" name="busHasLeftDoors" value="false" checked={formData.busHasLeftDoors === false} onChange={handleChange} required={showBusFields} /> Não</label>
                </div>
              </div>
            </div>
          </>
        )}

        <div className={styles.actions}>
          <button type="submit" className={styles.saveButton} disabled={!isFormValid || loading}>
            {loading ? 'Salvando...' : 'Salvar Veículo'}
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

export default VeiculoCadastro;
 
 
 
 
 
 
 
 
 
 
 

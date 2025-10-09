import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../VeiculoCadastro/VeiculoCadastro.module.css'; // Reutilizando os estilos
import api from '../../services/api';
import Modal from '../../components/Modal/Modal';
import { getTodayDate } from '../../utils/validators';

function VeiculoEdicao() {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o ID da URL

  const [formData, setFormData] = useState({});
  
  // Estados para popular os selects
  const [typeOptions, setTypeOptions] = useState([]);
  const [fuelTypeOptions, setFuelTypeOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);
  const [transmissionTypeOptions, setTransmissionTypeOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [ServiceTypeOptions, setServiceTypeOptions] = useState([]);
  const [chassisBrandOptions, setChassisBrandOptions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ isOpen: false, message: '', isError: false });

  // Busca todos os dados necessários (do veículo e dos selects)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          vehicleRes, typesRes, fuelTypesRes, brandsRes, colorsRes, 
          transmissionsRes, statusRes, servicesRes, chassisBrandsRes
        ] = await Promise.all([
          api.get(`/vehicles/${id}`),
          api.get('/vehicles/types'),
          api.get('/vehicles/fuelTypes'),
          api.get('/vehicles/brands'),
          api.get('/vehicles/colors'),
          api.get('/vehicles/transmissionTypes'),
          api.get('/vehicles/status'),
          api.get('/vehicles/serviceTypes'),
          api.get('/vehicles/chassisBrands'),
        ]);
        
        // Popula os selects
        setTypeOptions(typesRes.data.value || []);
        setFuelTypeOptions(fuelTypesRes.data.value || []);
        setBrandOptions(brandsRes.data.value || []);
        setColorOptions(colorsRes.data.value || []);
        setTransmissionTypeOptions(transmissionsRes.data.value || []);
        setStatusOptions(statusRes.data.value || []);
        setServiceTypeOptions(servicesRes.data.value || []);
        setChassisBrandOptions(chassisBrandsRes.data.value || []);

        // Prepara e preenche o formulário com os dados do veículo
        const vehicleData = vehicleRes.data.value;
        if (vehicleData.ipvaExpiration) vehicleData.ipvaExpiration = vehicleData.ipvaExpiration.split('T')[0];
        if (vehicleData.busInsuranceExpiration) vehicleData.busInsuranceExpiration = vehicleData.busInsuranceExpiration.split('T')[0];
        if (vehicleData.busFumigateExpiration) vehicleData.busFumigateExpiration = vehicleData.busFumigateExpiration.split('T')[0];
        setFormData(vehicleData);

      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setFeedback({ isOpen: true, message: "Não foi possível carregar os dados para edição.", isError: true });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => { 
    const { name, value, type } = e.target;
    // Lógica para radio buttons
    if (type === 'radio') {
      setFormData(prevState => ({ ...prevState, [name]: value === 'true' }));
    } else {
      setFormData(prevState => ({ ...prevState, [name]: value }));
    }};

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

   
    
    const payload = { ...formData,
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
      await api.put(`/vehicles/${id}`, payload);
      setFeedback({ isOpen: true, message: 'Veículo atualizado com sucesso!', isError: false });
    } catch (err) {
      // ... (tratamento de erro)
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseModal = () => {  
    setFeedback({ isOpen: false, message: '', isError: false });
    if (!feedback.isError) navigate('/veiculo');
  };

  const showBusFields = ['0', '1', '2'].includes(String(formData.type));

  if (loading) return <p className={styles.container}>Carregando dados do veículo...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Editar Veículo: {formData.plate}</h1>
        <button onClick={() => navigate('/veiculo')} className={styles.backButton}>
          Voltar para a Lista
        </button>
      </div>
      
      <form className={styles.form} onSubmit={handleUpdate} noValidate>
        <h2 className={styles.sectionTitle}>Informações Gerais</h2>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label>Tipo</label>
            <select name="type" value={formData.type} onChange={handleChange} required>
              <option value="">Selecione...</option>
              {typeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Prefixo</label>
            <input name="prefix" type="text" value={formData.prefix} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Número de Portas</label>
            <input name="numberDoors" type="number" value={formData.numberDoors} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Número de Assentos</label>
            <input name="numberSeats" type="number" value={formData.numberSeats} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Tipo de Combustível</label>
            <select name="fuelType" value={formData.fuelType} onChange={handleChange}>
              <option value="">Selecione...</option>
              {fuelTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Marca</label>
            <select name="brand" value={formData.brand} onChange={handleChange}>
              <option value="">Selecione...</option>
              {brandOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Modelo</label>
            <input name="model" type="text" value={formData.model} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Ano</label>
            <input name="year" type="number" placeholder="YYYY" value={formData.year} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Placa</label>
            <input name="plate" type="text" value={formData.plate} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Cor</label>
            <select name="color" value={formData.color} onChange={handleChange}>
              <option value="">Selecione...</option>
              {colorOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Número da Carroceria</label>
            <input name="bodyworkNumber" type="text" value={formData.bodyworkNumber} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Número do Chassi</label>
            <input name="numberChassis" type="text" value={formData.numberChassis} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Número de Eixos</label>
            <input name="axesNumber" type="number" value={formData.axesNumber} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Vencimento do IPVA</label>
            <input name="ipvaExpiration" type="date" value={formData.ipvaExpiration} onChange={handleChange} min={getTodayDate()} />
          </div>
          <div className={styles.inputGroup}>
            <label>Licenciamento</label>
            <input name="licensing" type="text" value={formData.licensing} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Renavam</label>
            <input name="renavam" type="text" value={formData.renavam} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Tipo de Transmissão</label>
            <select name="transmissionType" value={formData.transmissionType} onChange={handleChange}>
              <option value="">Selecione...</option>
              {transmissionTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
                <option value="">Selecione...</option>
                {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
            </select>
          </div>
          <div className={styles.inputGroupRadio}>
            <label>Acessibilidade</label>
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
                <label>Serviço</label>
                <select name="busServiceType" value={formData.busServiceType} onChange={handleChange}>
                  <option value="">Selecione...</option>
                  {ServiceTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>Marca do Chassi</label>
                 <select name="busChassisBrand" value={formData.busChassisBrand} onChange={handleChange}>
                  <option value="">Selecione...</option>
                  {chassisBrandOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
                </select>   </div>
              <div className={styles.inputGroup}>
                <label>Modelo do Chassi</label>
                <input name="busChassisModel" type="text" value={formData.busChassisModel} onChange={handleChange} />
              </div>
              <div className={styles.inputGroup}>
                <label>Ano do Chassi</label>
                <input name="busChassisYear" type="number" placeholder="YYYY" value={formData.busChassisYear} onChange={handleChange} />
              </div>
              <div className={styles.inputGroup}>
                <label>Vencimento do Seguro</label>
                <input name="busInsuranceExpiration" type="date" value={formData.busInsuranceExpiration} onChange={handleChange} />
              </div>
              <div className={styles.inputGroup}>
                <label>Próxima Detetização</label>
                <input name="busFumigateExpiration" type="date" value={formData.busFumigateExpiration} onChange={handleChange} />
              </div>
              <div className={styles.inputGroupRadio}>
                <label>Piso Baixo</label>
                <div>
                  <label><input type="radio" name="busHasLowFloor" value="true" checked={formData.busHasLowFloor === true} onChange={handleChange} /> Sim</label>
                  <label><input type="radio" name="busHasLowFloor" value="false" checked={formData.busHasLowFloor === false} onChange={handleChange} /> Não</label>
                </div>
              </div>
              <div className={styles.inputGroupRadio}>
                <label>Portas à Esquerda</label>
                <div>
                  <label><input type="radio" name="busHasLeftDoors" value="true" checked={formData.busHasLeftDoors === true} onChange={handleChange} /> Sim</label>
                  <label><input type="radio" name="busHasLeftDoors" value="false" checked={formData.busHasLeftDoors === false} onChange={handleChange} /> Não</label>
                </div>
              </div>
            </div>
          </>
        )}

        <div className={styles.actions}>
          <button type="submit" className={styles.saveButton} disabled={loading}>
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


export default VeiculoEdicao;
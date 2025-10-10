//importações// 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FuncionarioCadastro.module.css';
import api from '../../services/api';
import Modal from '../../components/Modal/Modal';
import { validateCPF, maskCPF, maskPhone, getTodayDate } from '../../utils/validators';

const sizeFile = 5 * 1024 * 1024; // filtra arquivos ate 5MB
const fileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/heic']; //strings do tipo mime que armazenam o formato do arquivo

// Componente principal

function FuncionarioCadastro() {
  const navigate = useNavigate();

  // Nomes dos campos alinhados com a API (camelCase em inglês)
  const [formData, setFormData] = useState({
    name: '', rg: '', cpf: '', bloodType: '', code: '', role: '',
    email: '', phone: '', hiringDate: '', cnhNumber: '',  cnhExpiration: '', status: '', image: null,
    password: '', //tira isto
  });
  
  //declara estados para cada enum(select) que será populado pela api
  const [roleOptions, setRoleOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [bloodTypeOptions, setBloodTypeOptions] = useState([]);


//declara estados para validação do formulário erro, se todos os campos forma preenchidos, de carregamento e de modais
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ isOpen: false, message: '', isError: false });


  // Efeito para buscar as opções dos filtros (status, cargos, etc.)
 useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [rolesRes, statusRes, bloodTypesRes] = await Promise.all([
          api.get('/employees/roles'),
          api.get('/employees/status'),
          api.get('/employees/bloodTypes'),
          
        ]);
        // Log para depuração final
        console.log('Opções de Cargo recebidas:', rolesRes.data.value);
        
        setRoleOptions(rolesRes.data.value || []);
        setStatusOptions(statusRes.data.value || []);
        setBloodTypeOptions(bloodTypesRes.data.value || []);
       
      } catch (err) {
        console.error("Erro ao buscar opções de filtro:", err);
        setFeedback({ isOpen: true, message: "Não foi possível carregar as opções do formulário.", isError: true });
      }
    };
    fetchFilterOptions();
  }, []);

  //userEffect onde cada vez que formData ou errors mudam, ele valida o formulario
  useEffect(() => {
    const requiredFields = [
      'name', 'rg', 'cpf', 'bloodType', 'code', 'role',
      'phone', 'status', 'email'
    ];



 // 2. Verifica se a CNH é obrigatória
    // IMPORTANTE: Confirme se os IDs para Fiscal e Supervisor são '0' e '1' na sua API.
    const roleId = formData.role;
    const isCnhRequired = !['0', '1','2'].includes(roleId);

    // 3. Adiciona campos de CNH se necessário
    if (isCnhRequired) {
      requiredFields.push('cnhNumber', 'cnhExpiration');
    }
    // Verifica se todos os campos obrigatórios estão preenchidos e se não há erros
    const allRequiredFilled = requiredFields.every(field => formData[field] && formData[field].toString().trim() !== '');
    const noErrors = Object.keys(errors).length === 0;
    
    setIsFormValid(allRequiredFilled && noErrors);
  }, [formData, errors]);

  //validação de rg, cpf, telefone e mascara de cpf e telefone
   const handleChange = (e) => {
   const { name, value } = e.target;

// Log para vermos o que está acontecendo
    console.log(`--- CAMPO ALTERADO ---`);
    console.log(`Nome do campo (name): ${name}`);
    console.log(`Valor selecionado (value): ${value}`);
    

    let finalValue = value;

    if (name === 'cpf') finalValue = maskCPF(value);
    else if (name === 'phone') finalValue = maskPhone(value);
    else if (name === 'rg') {
      const upperValue = value.toUpperCase();
      finalValue = upperValue.replace(/[^0-9X]/g, '').replace(/X(.)+/g, 'X').substring(0, 9);
    }
      else if (name === 'cnhNumber') {
      // Permite apenas números
      finalValue = value.replace(/\D/g, '');
    }
    
    setFormData(prevState => ({ ...prevState, [name]: finalValue }));

    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  // tratamentos específicos para CPF ao sair do campo, chama o metodo validateCPF

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };

 if (name === 'cpf') {
      if (value && !validateCPF(value)) newErrors.cpf = 'CPF inválido.';
      else delete newErrors.cpf;
    }
    if (name === 'rg') {
      if (value && value.length !== 9) newErrors.rg = 'O RG deve conter 9 caracteres.';
      else delete newErrors.rg;
    }
    if (name === 'cnhNumber') {
      if (value && value.length !== 11) newErrors.cnhNumber = 'A CNH deve conter 11 dígitos.';
      else delete newErrors.cnhNumber;
    }
    setErrors(newErrors);
  };

  //metodo para validação de tamanho e tipo do arquivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
   if (!file) {
      setFormData(prevState => ({ ...prevState, image: null }));
      return;
    }

    if (!fileTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, image: 'Tipo de arquivo inválido.' }));
      return;
    }
    if (file.size > sizeFile) {
      setErrors(prev => ({ ...prev, image: 'O arquivo excede 5MB.' }));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      setFormData(prevState => ({ ...prevState, image: base64String }));
    };
    reader.onerror = (error) => {
      console.error("Erro ao ler o arquivo:", error);
      setErrors(prev => ({ ...prev, image: 'Erro ao processar a imagem.' }));
    };
  };

// PASSO 3: 
    const handleSave = async (e) => {
    e.preventDefault();


    if (!isFormValid) {
       setFeedback({ isOpen: true, message: 'Preencha todos os campos obrigatórios.', isError: true });
        return;
    }
    setLoading(true);
    const payload = {
      name: formData.name,
      rg: formData.rg,
      cpf: formData.cpf.replace(/[^\d]/g, ''),
      bloodType: parseInt(formData.bloodType, 10),
      code: formData.code,
      role: parseInt(formData.role, 10),
      email: formData.email,
      phone: formData.phone.replace(/[^\d]/g, ''),
      hiringDate: formData.hiringDate || null,
      cnhNumber: formData.cnhNumber,
      cnhExpiration: formData.cnhExpiration,
      status: parseInt(formData.status, 10),
      image: formData.image,
      // Removido o campo 'password' para alinhar com o teste do Swagger, adicione se for necessário
    };

    try {
      await api.post('/employees', payload);
      setFeedback({ isOpen: true, message: 'Funcionário cadastrado com sucesso!', isError: false });
    } catch (err) {
      const errorList = err.response?.data?.errors;
      let detailedMessage = 'Erro ao cadastrar funcionário. Verifique os dados.';
      if (errorList && Array.isArray(errorList) && errorList.length > 0) {
        detailedMessage = errorList.map(item => item.message).join(' ');
      }
      setFeedback({ isOpen: true, message: detailedMessage, isError: true });
    } finally {
      setLoading(false);
    }
  };
    


  const handleCloseModal = () => {
    setFeedback({ isOpen: false, message: '', isError: false });
    if (!feedback.isError) navigate('/funcionario');
  };

  return (
  <div className={styles.container}>
      <div className={styles.header}>
        <h1>Cadastrar Novo Funcionário</h1>
        <button onClick={() => navigate('/funcionario')} className={styles.backButton}>Voltar</button>
      </div>
      
      <form className={styles.form} onSubmit={handleSave} noValidate>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Nome <span className={styles.required}>*</span></label>
            <input name="name" type="text" value={formData.name} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="rg">RG <span className={styles.required}>*</span></label>
            <input name="rg" type="text" value={formData.rg} onChange={handleChange} onBlur={handleBlur} maxLength="11" required />
            {errors.rg && <small className={styles.errorText}>{errors.rg}</small>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="cpf">CPF <span className={styles.required}>*</span></label>
            <input name="cpf" type="text" value={formData.cpf} onChange={handleChange} onBlur={handleBlur} required />
            {errors.cpf && <small className={styles.errorText}>{errors.cpf}</small>}
          </div>
          <div className={styles.inputGroup}>
  <label htmlFor="bloodType">Tipo Sanguíneo <span className={styles.required}>*</span></label>
  <select name="bloodType" value={formData.bloodType} onChange={handleChange} required>

    <option value="">Selecione...</option>
    
    {bloodTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
  </select>
</div>
          <div className={styles.inputGroup}>
            <label htmlFor="code">Matrícula (Código) <span className={styles.required}>*</span></label>
            <input name="code" type="text" value={formData.code} onChange={handleChange} maxLength="10" required />
          </div>
   <div className={styles.inputGroup}>
            <label htmlFor="role">Cargo <span className={styles.required}>*</span></label>
            <select name="role" value={formData.role} onChange={handleChange} required>

                <option value="">Selecione...</option>

                {roleOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
            </select>
          </div>
        <div className={styles.inputGroup}>
  <label htmlFor="status">Status <span className={styles.required}>*</span></label>
   <select name="status" value={formData.status} onChange={handleChange} required>

      <option value="">Selecione...</option>
   
      {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
  </select>
</div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email <span className={styles.required}>*</span></label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="phone">Telefone <span className={styles.required}>*</span></label>
            <input name="phone" type="text" value={formData.phone} onChange={handleChange} required />
          </div>
            <div className={styles.inputGroup}>
            <label htmlFor="hiringDate">Data da Contratação <span className={styles.required}>*</span></label>
            <input name="hiringDate" type="date" value={formData.hiringDate} onChange={handleChange} max={getTodayDate()} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="cnhNumber">Número da CNH</label>
            <input name="cnhNumber" type="text" value={formData.cnhNumber} onChange={handleChange} onBlur={handleBlur} maxLength="11" />
            {errors.cnhNumber && <small className={styles.errorText}>{errors.cnhNumber}</small>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="cnhExpiration">Vencimento CNH <span className={styles.required}>*</span></label>
            <input name="cnhExpiration" type="date" value={formData.cnhExpiration} onChange={handleChange} min={getTodayDate()} required />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="image">Imagem do Perfil</label>
            <input name="image" type="file" onChange={handleFileChange} accept=".png, .jpg, .jpeg, .heic" />
            {errors.image && <small className={styles.errorText}>{errors.image}</small>}
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.saveButton} disabled={!isFormValid || loading}>
            {loading ? 'Salvando...' : 'Salvar Funcionário'}
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

export default FuncionarioCadastro;

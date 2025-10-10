import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../FuncionarioCadastro/FuncionarioCadastro.module.css'; // Reutilizando os estilos
import api from '../../services/api';
import Modal from '../../components/Modal/Modal';
import { validateCPF, maskCPF, maskPhone, getTodayDate } from '../../utils/validators';

function FuncionarioEdicao() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({});
  
  const [roleOptions, setRoleOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [bloodTypeOptions, setBloodTypeOptions] = useState([]);
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ isOpen: false, message: '', isError: false });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeeRes, rolesRes, statusRes, bloodTypesRes] = await Promise.all([
          api.get(`/employees/${id}`),
          api.get('/employees/roles'),
          api.get('/employees/status'),
          api.get('/employees/bloodTypes'),
       
        ]);

        setRoleOptions(rolesRes.data.value || []);
        setStatusOptions(statusRes.data.value || []);
        setBloodTypeOptions(bloodTypesRes.data.value || []);
     
     let employeeData = employeeRes.data.value;
        
        // ▼▼▼ CORREÇÃO APLICADA AQUI ▼▼▼
        // Garantimos que todos os IDs dos selects sejam strings para o formulário
        employeeData = {
          ...employeeData,
          status: employeeData.status.toString(),
          role: employeeData.role.toString(),
          bloodType: employeeData.bloodType.toString(),
          hiringDate: employeeData.hiringDate ? employeeData.hiringDate.split('T')[0] : '',
          cnhExpiration: employeeData.cnhExpiration ? employeeData.cnhExpiration.split('T')[0] : '',
        };

        //const employeeData = employeeRes.data.value;
      //  if (employeeData.hiringDate) employeeData.hiringDate = employeeData.hiringDate.split('T')[0];
       // if (employeeData.cnhExpiration) employeeData.cnhExpiration = employeeData.cnhExpiration.split('T')[0];
        setFormData(employeeData);

      } catch (error) {
        setFeedback({ isOpen: true, message: 'Não foi possível carregar os dados necessários para a edição.', isError: true });
      } finally {
        setLoading(false); 
      }
    };
    fetchData();
  }, [id]);


   useEffect(() => {
    let requiredFields = [
      'name', 'rg', 'cpf', 'bloodType', 'code', 'role',
      'phone', 'status', 'email', 'hiringDate', 'cnhExpiration'
    ];

    const roleId = formData.role;
    const isCnhRequired = !['0', '1','2'].includes(roleId);

    if (isCnhRequired) {
      requiredFields.push('cnhNumber');
    }

    const allRequiredFilled = requiredFields.every(field => formData[field] && formData[field].toString().trim() !== '');
    const noErrors = Object.keys(errors).length === 0;
    
    setIsFormValid(allRequiredFilled && noErrors);
  }, [formData, errors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === 'cpf') finalValue = maskCPF(value);
    else if (name === 'phone') finalValue = maskPhone(value);
     else if (name === 'rg') {
      const upperValue = value.toUpperCase();
      finalValue = upperValue.replace(/[^0-9X]/g, '').replace(/X(.)+/g, 'X');
    }
    else if (name === 'cnhNumber') {
      finalValue = value.replace(/\D/g, '');
    }
    setFormData(prevState => ({ ...prevState, [name]: finalValue }));
  if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
 
  };


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
  

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setFeedback({ isOpen: true, message: 'Verifique os campos obrigatórios e os erros de validação.', isError: true });
      return;
    }
    setLoading(true);
    
    const updatePayload = {
      id: parseInt(id, 10),
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
    };

    try {
      await api.put(`/employees/${id}`, updatePayload);
      setFeedback({ isOpen: true, message: 'Funcionário atualizado com sucesso!', isError: false });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar funcionário.';
      setFeedback({ isOpen: true, message: errorMessage, isError: true });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseModal = () => {
    setFeedback({ isOpen: false, message: '', isError: false });
    if (!feedback.isError) navigate('/funcionario');
  };

  if (loading) return <p className={styles.container}>Carregando dados do funcionário...</p>;

  return (
     <div className={styles.container}>
      <div className={styles.header}>
        <h1>Editar Funcionário: {formData.name}</h1>
        <button onClick={() => navigate('/funcionario')} className={styles.backButton}>
          Voltar para a Lista
        </button>
      </div>
      
      <form className={styles.form} onSubmit={handleUpdate} noValidate>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Nome <span className={styles.required}>*</span></label>
            <input name="name" type="text" value={formData.name || ''} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="rg">RG <span className={styles.required}>*</span></label>
            <input name="rg" type="text" value={formData.rg || ''} onChange={handleChange} onBlur={handleBlur} maxLength="11" required />
            {errors.rg && <small className={styles.errorText}>{errors.rg}</small>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="cpf">CPF <span className={styles.required}>*</span></label>
            <input name="cpf" type="text" value={formData.cpf || ''} onChange={handleChange} onBlur={handleBlur} required />
            {errors.cpf && <small className={styles.errorText}>{errors.cpf}</small>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="bloodType">Tipo Sanguíneo <span className={styles.required}>*</span></label>
            <select name="bloodType" value={formData.bloodType ?? ''} onChange={handleChange} required>
              <option value="">Selecione...</option>
              {bloodTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="code">Matrícula (Código) <span className={styles.required}>*</span></label>
            <input name="code" type="text" value={formData.code || ''} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="role">Cargo <span className={styles.required}>*</span></label>
            <select name="role" value={formData.role ?? ''} onChange={handleChange} required>
                <option value="">Selecione...</option>
                {roleOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="status">Status <span className={styles.required}>*</span></label>
             <select name="status" value={formData.status ?? ''} onChange={handleChange} required>
                <option value="">Selecione...</option>
                {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email <span className={styles.required}>*</span></label>
            <input name="email" type="email" value={formData.email || ''} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="phone">Telefone <span className={styles.required}>*</span></label>
            <input name="phone" type="text" value={formData.phone || ''} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="hiringDate">Data da Contratação <span className={styles.required}>*</span></label>
            <input name="hiringDate" type="date" value={formData.hiringDate || ''} onChange={handleChange} max={getTodayDate()} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="cnhNumber">Número da CNH</label>
            <input name="cnhNumber" type="text" value={formData.cnhNumber || ''} onChange={handleChange} onBlur={handleBlur} maxLength="11" />
            {errors.cnhNumber && <small className={styles.errorText}>{errors.cnhNumber}</small>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="cnhExpiration">Vencimento CNH <span className={styles.required}>*</span></label>
            <input name="cnhExpiration" type="date" value={formData.cnhExpiration || ''} onChange={handleChange} min={getTodayDate()} required />
          </div>
        </div>
        
        <div className={styles.actions}>
          <button type="submit" className={styles.saveButton} disabled={!isFormValid || loading}>
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>

      <Modal isOpen={feedback.isOpen} onClose={handleCloseModal} showCloseButton={false} >
        <div className="feedback-modal-content">
          <h3>{feedback.isError ? 'Aconteceu um Erro' : 'Sucesso!'}</h3>
          <p>{feedback.message}</p>

       <div className="logout-modal-buttons">
           
          <button onClick={handleCloseModal} className="btn-primary">Fechar</button>
        </div>
        </div>
      </Modal>
    </div>
  );
}

export default FuncionarioEdicao;
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../FuncionarioCadastro/FuncionarioCadastro.module.css'; // Reutilizando os estilos
import api from '../../services/api';
import Modal from '../../components/Modal/Modal';
import { maskCPF, maskPhone } from '../../utils/validators';

function FuncionarioEdicao() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({});
  
  const [roleOptions, setRoleOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [bloodTypeOptions, setBloodTypeOptions] = useState([]);
  

  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ isOpen: false, message: '', isError: false });

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
        }

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === 'cpf') finalValue = maskCPF(value);
    if (name === 'phone') finalValue = maskPhone(value);
    setFormData(prevState => ({ ...prevState, [name]: finalValue }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
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
      
      <form className={styles.form} onSubmit={handleUpdate}>
        <div className={styles.formGrid}>
          {/* --- Campos do Formulário --- */}
          <div className={styles.inputGroup}>
            <label htmlFor="name">Nome</label>
            <input name="name" type="text" value={formData.name || ''} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="rg">RG</label>
            <input name="rg" type="text" value={formData.rg || ''} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="cpf">CPF</label>
            <input name="cpf" type="text" value={formData.cpf || ''} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="bloodType">Tipo Sanguíneo</label>
            {/* CORREÇÃO APLICADA AQUI */}
            <select name="bloodType" value={formData.bloodType || ''} onChange={handleChange} required>
              <option value="">Selecione...</option>
              {bloodTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="code">Matrícula (Código)</label>
            <input name="code" type="text" value={formData.code || ''} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="role">Cargo</label>
            {/* CORREÇÃO APLICADA AQUI */}
            <select name="role" value={formData.role || ''} onChange={handleChange} required>
                <option value="">Selecione...</option>
                {roleOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="status">Status</label>
            {/* CORREÇÃO APLICADA AQUI */}
             <select name="status" value={formData.status || ''} onChange={handleChange} required>
                <option value="">Selecione...</option>
                {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input name="email" type="email" value={formData.email || ''} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="phone">Telefone</label>
            <input name="phone" type="text" value={formData.phone || ''} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="hiringDate">Data da Contratação</label>
            <input name="hiringDate" type="date" value={formData.hiringDate || ''} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="cnhNumber">Número da CNH</label>
            <input name="cnhNumber" type="text" value={formData.cnhNumber || ''} onChange={handleChange} required />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="cnhExpiration">Vencimento CNH</label>
            <input name="cnhExpiration" type="date" value={formData.cnhExpiration || ''} onChange={handleChange} required />
          </div>
        </div>
        
        <div className={styles.actions}>
          <button type="submit" className={styles.saveButton} disabled={loading}>
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
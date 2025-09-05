import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FuncionarioCadastro.module.css';
import api from '../../services/api';
import Modal from '../../components/Modal/Modal';

// 1. Importe as novas funções
import { validateCPF, maskCPF, maskPhone, getTodayDate } from '../../utils/validators';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/heic'];



function CadastrarFuncionario() {
  const navigate = useNavigate();
  
  // Estados para cada um dos novos campos do formulário
  const [formData, setFormData] = useState({
    nome: '',
    rg: '',
    cpf: '',
    tipoSanguineo: '',
    codigo: '',
    cargo: '',
    email: '',
    phone: '',
    dataContratacao: '',
    numeroCnh: '',
    categoriaCnh: '',
    vencimentoCnh: '',
    status: '',
    imagem: null,
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ isOpen: false, message: '', isError: false });

  // Função para atualizar o estado do formulário de forma genérica
  useEffect(() => {
    const requiredFields = [
      'nome', 'rg', 'cpf', 'tipoSanguineo', 'codigo', 'cargo',
      'phone', 'numeroCnh', 'vencimentoCnh', 'status'
    ];
    const allRequiredFilled = requiredFields.every(field => !!formData[field]);
    const noErrors = Object.keys(errors).length === 0;
    
    setIsFormValid(allRequiredFilled && noErrors);
  }, [formData, errors]);


    const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === 'cpf') {
      finalValue = maskCPF(value);
    } 
    else if (name === 'phone') {
      finalValue = maskPhone(value);
    } 
    else if (name === 'rg') {
      //  LÓGICA PARA O RG
      const upperValue = value.toUpperCase();
      // Remove tudo que não for dígito, exceto se for um 'X' no final, tudo que não for igual a 0 a 9 e x
      finalValue = upperValue.replace(/[^0-9X]/g, '').replace(/X(.)+/g, 'X');
      // Limita o tamanho total a 9 caracteres
      finalValue = finalValue.substring(0, 9);
    }
    
    setFormData(prevState => ({ ...prevState, [name]: finalValue }));

    if (errors[name]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // 4. Validação ao sair do campo
  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === 'cpf' && value && !validateCPF(value)) {
      setErrors(prev => ({ ...prev, cpf: 'CPF inválido.' }));
    }
    // Adicione outras validações onBlur aqui se necessário (ex: RG)
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setErrors(prev => ({ ...prev, imagem: 'Tipo de arquivo inválido. Use PNG, JPG, JPEG ou HEIC.' }));
      e.target.value = null; // Limpa o input
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrors(prev => ({ ...prev, imagem: 'O arquivo não pode exceder 5MB.' }));
      e.target.value = null; // Limpa o input
      return;
    }

    setFormData(prevState => ({ ...prevState, imagem: file }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
        setFeedback({ isOpen: true, message: 'Por favor, preencha todos os campos obrigatórios e corrija os erros.', isError: true });
        return;
    }
    setLoading(true);

    // 5. Trata os dados antes de enviar
    const cleanedData = {
      ...formData,
      cpf: formData.cpf.replace(/[^\d]/g, ''),
      rg: formData.rg.replace(/[^\d]/g, ''),
      phone: formData.phone.replace(/[^\d]/g, ''),
    };

    const dataToSend = new FormData();
    for (const key in cleanedData) {
      dataToSend.append(key, cleanedData[key]);
    }
    
    try {
      await api.post('/users', dataToSend);
      setFeedback({ isOpen: true, message: 'Funcionário cadastrado com sucesso!', isError: false });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao cadastrar funcionário.';
      setFeedback({ isOpen: true, message: errorMessage, isError: true });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseModal = () => {
    setFeedback({ ...feedback, isOpen: false });
    if (!feedback.isError) navigate('/funcionario');
  };


  return (
    <div className={styles.container}>
      {/* ... Header ... */}
      <div className={styles.header}>
        <h1>Cadastrar Novo Funcionário</h1>
        <button onClick={() => navigate('/funcionario')} className={styles.backButton}>
          Voltar para a Lista
        </button>
      </div>
      
      <form className={styles.form} onSubmit={handleSave}>
        <div className={styles.formGrid}>
          {/* Nome */}
          <div className={styles.inputGroup}>
            <label htmlFor="nome">Nome <span className={styles.required}>*</span></label>
            <input name="nome" type="text" value={formData.nome} onChange={handleChange} maxLength="100" required />
          </div>
          {/* RG */}
          <div className={styles.inputGroup}>
            <label htmlFor="rg">RG <span className={styles.required}>*</span></label>
            <input name="rg" type="text" value={formData.rg} onChange={handleChange} maxLength="9" required />
          </div>
          {/* CPF */}
          <div className={styles.inputGroup}>
            <label htmlFor="cpf">CPF <span className={styles.required}>*</span></label>
            <input name="cpf" type="text" value={formData.cpf} onChange={handleChange} onBlur={handleBlur} required />
            {errors.cpf && <small className={styles.errorText}>{errors.cpf}</small>}
          </div>
          {/* Tipo Sanguíneo */}
          <div className={styles.inputGroup}>
            <label htmlFor="tipoSanguineo">Tipo Sanguíneo <span className={styles.required}>*</span></label>
            <select name="tipoSanguineo" value={formData.tipoSanguineo} onChange={handleChange} required>
              <option value="">Selecione...</option><option value="1">A+</option><option value="2">A-</option>
              <option value="3">B+</option><option value="4">B-</option><option value="5">AB+</option>
              <option value="6">AB-</option><option value="7">O+</option><option value="8">O-</option>
            </select>
          </div>
          {/* Código */}
          <div className={styles.inputGroup}>
            <label htmlFor="codigo">Código <span className={styles.required}>*</span></label>
            <input name="codigo" type="text" value={formData.codigo} onChange={handleChange} maxLength="10" required />
          </div>
          {/* Cargo */}
          <div className={styles.inputGroup}>
            <label htmlFor="cargo">Cargo <span className={styles.required}>*</span></label>
            <select name="cargo" value={formData.cargo} onChange={handleChange} required>
                <option value="">Selecione...</option><option value="1">Motorista</option><option value="2">Cobrador</option>
                <option value="3">Manutenção</option><option value="4">Administrativo</option>
            </select>
          </div>
          {/* Status */}
          <div className={styles.inputGroup}>
            <label htmlFor="status">Status <span className={styles.required}>*</span></label>
             <select name="status" value={formData.status} onChange={handleChange} required>
                <option value="">Selecione...</option><option value="1">Ativo</option><option value="0">Inativo</option>
            </select>
          </div>
          {/* Email */}
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} />
          </div>
          {/* Telefone */}
          <div className={styles.inputGroup}>
            <label htmlFor="phone">Telefone <span className={styles.required}>*</span></label>
            <input name="phone" type="text" value={formData.phone} onChange={handleChange} required />
          </div>
          {/* Data da Contratação */}
          <div className={styles.inputGroup}>
            <label htmlFor="dataContratacao">Data da Contratação</label>
            <input name="dataContratacao" type="date" value={formData.dataContratacao} onChange={handleChange} />
          </div>
          {/* Número da CNH */}
          <div className={styles.inputGroup}>
            <label htmlFor="numeroCnh">Número da CNH <span className={styles.required}>*</span></label>
            <input name="numeroCnh" type="text" value={formData.numeroCnh} onChange={handleChange} maxLength="11" required />
          </div>
           {/* Categoria CNH */}
          <div className={styles.inputGroup}>
            <label htmlFor="categoriaCnh">Categoria CNH</label>
             <select name="categoriaCnh" value={formData.categoriaCnh} onChange={handleChange}>
                <option value="">Selecione...</option><option value="1">A</option><option value="2">B</option>
                <option value="3">C</option><option value="4">D</option><option value="5">E</option>
            </select>
          </div>
          {/* Vencimento CNH */}
          <div className={styles.inputGroup}>
            <label htmlFor="vencimentoCnh">Vencimento CNH <span className={styles.required}>*</span></label>
            <input name="vencimentoCnh" type="date" value={formData.vencimentoCnh} onChange={handleChange} min={getTodayDate()} required />
          </div>
          {/* Imagem */}
          <div className={styles.inputGroup}>
            <label htmlFor="imagem">Imagem do Perfil</label>
            <input name="imagem" type="file" onChange={handleFileChange} accept=".png, .jpg, .jpeg, .heic" />
            {errors.imagem && <small className={styles.errorText}>{errors.imagem}</small>}
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.saveButton} disabled={!isFormValid || loading}>
            {loading ? 'Salvando...' : 'Salvar Funcionário'}
          </button>
        </div>
      </form>

      <Modal isOpen={feedback.isOpen} onClose={handleCloseModal}>
        {/* ... (código do modal de feedback) ... */}
      </Modal>
    </div>
  );
}

export default CadastrarFuncionario;


import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// Vamos reutilizar os estilos da tela de Cadastro, pois são idênticos
import styles from '../FuncionarioCadastro/FuncionarioCadastro.module.css'; // Reutilizando os estilos
import api from '../../services/api';
import Modal from '../../components/Modal/Modal';

function FuncionarioEdicao() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({}); // Começa como objeto vazio
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ isOpen: false, message: '', isError: false });

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await api.get(`/employees/${id}`);
        const data = response.data;
        // Formata as datas que vêm da API para o formato 'yyyy-mm-dd'
        if (data.dataContratacao) data.dataContratacao = data.dataContratacao.split('T')[0];
        if (data.vencimentoCnh) data.vencimentoCnh = data.vencimentoCnh.split('T')[0];
        
        setFormData(data);
      } catch (error) {
        setFeedback({ isOpen: true, message: 'Não foi possível carregar os dados do funcionário.', isError: true });
      } finally {
        setLoading(false); 
      }
    };
    fetchEmployeeData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // O backend não deve receber o ID no corpo da requisição PUT/PATCH
    const { id: employeeId, ...updateData } = formData;

    try {
      await api.put(`/employees/${employeeId}`, updateData);
      setFeedback({ isOpen: true, message: 'Funcionário atualizado com sucesso!', isError: false });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar funcionário.';
      setFeedback({ isOpen: true, message: errorMessage, isError: true });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseModal = () => {
    setFeedback({ ...feedback, isOpen: false });
    if (!feedback.isError) navigate('/funcionario');
  };

  if (loading) return <p className={styles.container}>Carregando dados do funcionário...</p>;

  return (
    // A estrutura JSX inteira foi revisada para garantir que todas as tags estão fechadas corretamente
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Editar Funcionário</h1>
        <button onClick={() => navigate('/funcionario')} className={styles.backButton}>
          Voltar para a Lista
        </button>
      </div>
      
      <form className={styles.form} onSubmit={handleUpdate}>
        <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
                <label htmlFor="nome">Nome</label>
                <input name="nome" type="text" value={formData.name || ''} onChange={handleChange} required />
            </div>
            {/* Adicione todos os outros campos do seu formulário aqui, seguindo o modelo acima */}
            {/* Exemplo: */}
            <div className={styles.inputGroup}>
                <label htmlFor="cpf">CPF</label>
                <input name="cpf" type="text" value={formData.cpf || ''} onChange={handleChange} required />
            </div>
             <div className={styles.inputGroup}>
                <label htmlFor="cargo">Cargo</label>
                <input name="cargo" type="text" value={formData.cargo || ''} onChange={handleChange} required />
            </div>
             <div className={styles.inputGroup}>
                <label htmlFor="codigo">Código</label>
                <input name="codigo" type="text" value={formData.codigo || ''} onChange={handleChange} required />
            </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.saveButton} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>

      <Modal isOpen={feedback.isOpen} onClose={handleCloseModal}>
        <div className="feedback-modal-content">
          <h3>{feedback.isError ? 'Ocorreu um Erro' : 'Sucesso!'}</h3>
          <p>{feedback.message}</p>
          <button onClick={handleCloseModal} className="feedback-modal-button">
            Fechar
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default FuncionarioEdicao;
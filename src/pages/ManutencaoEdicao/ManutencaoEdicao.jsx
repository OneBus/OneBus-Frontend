import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ManutencaoEdicao.module.css'; // Usando o CSS copiado

// Simula um "banco de dados" de onde buscaremos a manutenção para editar
const mockDatabase = [
  { id: 1, prefixo: '1001', setor: 'mecanica', descricao: 'Troca de óleo e filtros do motor do veículo Placa ABC-1234', dataInicio: '2025-09-15T08:00', dataTermino: '2025-09-15T10:30', vistoriaVencimento: '2025-12-20' },
  { id: 2, prefixo: '1002', setor: 'borracharia', descricao: 'Rodízio e calibragem de pneus do veículo Placa XYZ-5678', dataInicio: '2025-09-16T09:00', dataTermino: '2025-09-16T09:45', vistoriaVencimento: '' },
];

// Mock de dados para o <select> de prefixos
const mockVeiculos = [
    { id: 1, prefixo: '1001' },
    { id: 2, prefixo: '1002' },
    { id: 3, prefixo: '2005' },
];

function ManutencaoEdicao() {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o ID da manutenção da URL

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  // Efeito para "buscar" os dados da manutenção quando a página carrega
  useEffect(() => {
    console.log("Procurando manutenção com ID:", id);
    const maintenanceData = mockDatabase.find(m => m.id === parseInt(id, 10));
    
    if (maintenanceData) {
      setFormData(maintenanceData);
    } else {
      console.error("Manutenção não encontrada no mock!");
    }
    setLoading(false);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log("Dados da manutenção atualizados:", formData);
    alert('Mockup: Alterações salvas no console!');
    navigate('/manutencao');
  };

  if (loading) return <p className={styles.container}>Carregando dados da manutenção...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Editar Agendamento</h1>
        <button onClick={() => navigate('/manutencao')} className={styles.backButton}>
          Voltar para a Lista
        </button>
      </div>
      
      <form className={styles.form} onSubmit={handleUpdate} noValidate>
        <div className={styles.formGrid}>
          {/* Campo Prefixo do Veículo */}
          <div className={styles.inputGroup}>
            <label htmlFor="prefixo">Prefixo do Veículo</label>
            <select name="prefixo" id="prefixo" value={formData.prefixo || ''} onChange={handleChange} required>
              <option value="">Selecione o veículo...</option>
              {mockVeiculos.map(veiculo => (
                <option key={veiculo.id} value={veiculo.prefixo}>{veiculo.prefixo}</option>
              ))}
            </select>
          </div>

          {/* Campo Setor */}
          <div className={styles.inputGroup}>
            <label htmlFor="setor">Setor</label>
            <select name="setor" id="setor" value={formData.setor || ''} onChange={handleChange} required>
              <option value="">Selecione...</option>
              <option value="borracharia">Borracharia</option>
              <option value="funilaria">Funilaria</option>
              <option value="mecanica">Mecânica</option>
              <option value="outros">Outros</option>
            </select>
          </div>

          {/* Campo Data Início */}
          <div className={styles.inputGroup}>
            <label htmlFor="dataInicio">Data e Hora de Início</label>
            <input name="dataInicio" id="dataInicio" type="datetime-local" value={formData.dataInicio || ''} onChange={handleChange} required />
          </div>

          {/* Campo Data Término */}
          <div className={styles.inputGroup}>
            <label htmlFor="dataTermino">Data e Hora de Término</label>
            <input name="dataTermino" id="dataTermino" type="datetime-local" value={formData.dataTermino || ''} onChange={handleChange} />
          </div>
          
          {/* Campo Vencimento da Vistoria */}
          <div className={styles.inputGroup}>
            <label htmlFor="vistoriaVencimento">Vencimento da Vistoria</label>
            <input name="vistoriaVencimento" id="vistoriaVencimento" type="date" value={formData.vistoriaVencimento || ''} onChange={handleChange} />
          </div>

          {/* Campo Descrição */}
          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label htmlFor="descricao">Descrição do Serviço</label>
            <textarea name="descricao" id="descricao" rows="4" value={formData.descricao || ''} onChange={handleChange} required></textarea>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.saveButton}>
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
}

export default ManutencaoEdicao;
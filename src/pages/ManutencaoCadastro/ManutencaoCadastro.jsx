import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ManutencaoCadastro.module.css'; // Usando o CSS copiado

// Mock de dados para o <select> de prefixos
const mockVeiculos = [
    { id: 1, prefixo: '00898' },
    { id: 2, prefixo: '00859' },
    { id: 3, prefixo: '21.574' },
];

function ManutencaoCadastro() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    prefixo: '',
    setor: '',
    descricao: '',
    dataInicio: '',
    dataTermino: '',
    vistoriaVencimento: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Dados da manutenção a serem salvos:", formData);
    alert('Mockup: Manutenção salva no console!');
    navigate('/manutencao');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Agendar Nova Manutenção</h1>
        <button onClick={() => navigate('/manutencao')} className={styles.backButton}>
          Voltar para a Lista
        </button>
      </div>
      
      <form className={styles.form} onSubmit={handleSave} noValidate>
        <div className={styles.formGrid}>
          {/* Campo Prefixo do Veículo */}
          <div className={styles.inputGroup}>
            <label htmlFor="prefixo">Prefixo do Veículo</label>
            <select name="prefixo" id="prefixo" value={formData.prefixo} onChange={handleChange} required>
              <option value="">Selecione o veículo...</option>
              {mockVeiculos.map(veiculo => (
                <option key={veiculo.id} value={veiculo.prefixo}>{veiculo.prefixo}</option>
              ))}
            </select>
          </div>

          {/* Campo Setor */}
          <div className={styles.inputGroup}>
            <label htmlFor="setor">Setor</label>
            <select name="setor" id="setor" value={formData.setor} onChange={handleChange} required>
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
            <input name="dataInicio" id="dataInicio" type="datetime-local" value={formData.dataInicio} onChange={handleChange} required />
          </div>

          {/* Campo Data Término */}
          <div className={styles.inputGroup}>
            <label htmlFor="dataTermino">Data e Hora de Término</label>
            <input name="dataTermino" id="dataTermino" type="datetime-local" value={formData.dataTermino} onChange={handleChange} />
          </div>
          
          {/* Campo Vencimento da Vistoria */}
          <div className={styles.inputGroup}>
            <label htmlFor="vistoriaVencimento">Vencimento da Vistoria</label>
            <input name="vistoriaVencimento" id="vistoriaVencimento" type="date" value={formData.vistoriaVencimento} onChange={handleChange} />
          </div>

          {/* Campo Descrição */}
          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label htmlFor="descricao">Descrição do Serviço</label>
            <textarea name="descricao" id="descricao" rows="4" placeholder="Descreva o serviço a ser realizado..." value={formData.descricao} onChange={handleChange} required></textarea>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.saveButton}>
            Salvar Agendamento
          </button>
        </div>
      </form>
    </div>
  );
}

export default ManutencaoCadastro;
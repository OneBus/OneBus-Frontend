import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LinhaCadastro.module.css'; // Usando o CSS copiado

function LinhaCadastro() {
  const navigate = useNavigate();

  // Estado para os dados do formulário da linha
  const [formData, setFormData] = useState({
    numero: '',
    nome: '',
    tipo: '',
    tempoViagem: '',
    quilometragem: '',
    sentido: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Dados da linha a serem salvos:", formData);
    alert('Mockup: Linha salva no console!');
    navigate('/linha'); // Rota de exemplo para a lista de linhas
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
          {/* Campo Número */}
          <div className={styles.inputGroup}>
            <label htmlFor="numero">Número da Linha</label>
            <input name="numero" id="numero" type="text" placeholder="Ex: 824EX1" value={formData.numero} onChange={handleChange} required />
          </div>

          {/* Campo Nome */}
          <div className={styles.inputGroup}>
            <label htmlFor="nome">Nome da Linha</label>
            <input name="nome" id="nome" type="text" placeholder="Ex: Jd. Isaura - Lapa" value={formData.nome} onChange={handleChange} required />
          </div>

          {/* Campo Tipo */}
          <div className={styles.inputGroup}>
            <label htmlFor="tipo">Tipo</label>
            <select name="tipo" id="tipo" value={formData.tipo} onChange={handleChange} required>
              <option value="">Selecione...</option>
              <option value="municipal">Municipal</option>
              <option value="intermunicipal">Intermunicipal</option>
              <option value="suburbano">Suburbano</option>
              <option value="seletivo">Seletivo</option>
            </select>
          </div>

          {/* Campo Tempo de Viagem */}
          <div className={styles.inputGroup}>
            <label htmlFor="tempoViagem">Tempo de Viagem</label>
            <input name="tempoViagem" id="tempoViagem" type="text" value={formData.tempoViagem} onChange={handleChange} />
          </div>

          {/* Campo Quilometragem */}
          <div className={styles.inputGroup}>
            <label htmlFor="quilometragem">Quilometragem (KM)</label>
            <input name="quilometragem" id="quilometragem" type="number" step="0.1" placeholder="Ex: 25.5" value={formData.quilometragem} onChange={handleChange} />
          </div>

          {/* Campo Sentido */}
          <div className={styles.inputGroup}>
            <label htmlFor="sentido">Sentido</label>
            <select name="sentido" id="sentido" value={formData.sentido} onChange={handleChange} required>
              <option value="">Selecione...</option>
              <option value="ida">Ida</option>
              <option value="volta">Volta</option>
              <option value="circular">Circular</option>
            </select>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.saveButton}>
            Salvar Linha
          </button>
        </div>
      </form>
    </div>
  );
}

export default LinhaCadastro;

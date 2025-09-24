import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LinhaHorarioCadastro.module.css'; // Usando o CSS copiado

// Mock de dados para o <select> de linhas
const mockLinhas = [
    { id: 1, nome: '824EX1 - Jd. Isaura' },
    { id: 2, nome: '577P-10 - Jd. Miriam' },
    { id: 3, nome: '408A-10 - Machado de Assis' },
];

function LinhaHorarioCadastro() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    linhaId: '',
    sentido: '',
    horaInicio: '',
    horaFim: '',
    dia: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Dados do horário da linha a serem salvos:", formData);
    alert('Mockup: Horário da linha salvo no console!');
    navigate('/linha-horario');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Cadastrar Horário da Linha</h1>
        <button onClick={() => navigate('/linha-horario')} className={styles.backButton}>
          Voltar para a Lista
        </button>
      </div>
      
      <form className={styles.form} onSubmit={handleSave} noValidate>
        <div className={styles.formGrid}>
          {/* Campo Linha */}
          <div className={styles.inputGroup}>
            <label htmlFor="linhaId">Linha</label>
            <select name="linhaId" id="linhaId" value={formData.linhaId} onChange={handleChange} required>
              <option value="">Selecione a linha...</option>
              {mockLinhas.map(linha => (
                <option key={linha.id} value={linha.id}>{linha.nome}</option>
              ))}
            </select>
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

          {/* Campo Hora Início */}
          <div className={styles.inputGroup}>
            <label htmlFor="horaInicio">Hora de Início</label>
            <input name="horaInicio" id="horaInicio" type="time" value={formData.horaInicio} onChange={handleChange} required />
          </div>

          {/* Campo Hora Fim */}
          <div className={styles.inputGroup}>
            <label htmlFor="horaFim">Hora de Fim</label>
            <input name="horaFim" id="horaFim" type="time" value={formData.horaFim} onChange={handleChange} required />
          </div>

          {/* Campo Dia */}
          <div className={styles.inputGroup}>
            <label htmlFor="dia">Dia de Operação</label>
            <select name="dia" id="dia" value={formData.dia} onChange={handleChange} required>
              <option value="">Selecione...</option>
              <option value="seg-sex">Segunda a Sexta</option>
              <option value="sab">Sábados</option>
              <option value="dom-fer">Domingos e Feriados</option>
            </select>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.saveButton}>
            Salvar Horário
          </button>
        </div>
      </form>
    </div>
  );
}

export default LinhaHorarioCadastro;
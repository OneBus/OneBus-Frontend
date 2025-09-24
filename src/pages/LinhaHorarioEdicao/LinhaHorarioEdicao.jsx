import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './LinhaHorarioEdicao.module.css'; // Usando o CSS copiado

// Simula um "banco de dados" de onde buscaremos o horário para editar
const mockDatabase = [
  { id: 1, linhaId: '1', linhaNome: '824EX1 - Jd. Isaura', horaInicio: '04:30', horaFim: '23:00', dia: 'seg-sex', sentido: 'circular' },
  { id: 2, linhaId: '2', linhaNome: '577P-10 - Jd. Miriam', horaInicio: '05:00', horaFim: '00:00', dia: 'seg-sex', sentido: 'ida-volta' },
  { id: 3, linhaId: '1', linhaNome: '824EX1 - Jd. Isaura', horaInicio: '05:30', horaFim: '22:00', dia: 'sab', sentido: 'circular' },
  { id: 4, linhaId: '2', linhaNome: '577P-10 - Jd. Miriam', horaInicio: '06:00', horaFim: '23:30', dia: 'dom-fer', sentido: 'ida-volta' },
];

// Mock de dados para o <select> de linhas
const mockLinhas = [
    { id: 1, nome: '824EX1 - Jd. Isaura' },
    { id: 2, nome: '577P-10 - Jd. Miriam' },
    { id: 3, nome: '408A-10 - Machado de Assis' },
];

function LinhaHorarioEdicao() {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o ID do horário da URL

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  // Efeito para "buscar" os dados do horário quando a página carrega
  useEffect(() => {
    console.log("Procurando horário com ID:", id);
    const scheduleData = mockDatabase.find(h => h.id === parseInt(id, 10));
    
    if (scheduleData) {
      setFormData(scheduleData);
    } else {
      console.error("Horário não encontrado no mock!");
    }
    setLoading(false);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log("Dados do horário atualizados:", formData);
    alert('Mockup: Alterações salvas no console!');
    navigate('/linha-horario');
  };

  if (loading) return <p className={styles.container}>Carregando dados do horário...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Editar Horário da Linha: {formData.linhaNome || '...'}</h1>
        <button onClick={() => navigate('/linha-horario')} className={styles.backButton}>
          Voltar para a Lista
        </button>
      </div>
      
      <form className={styles.form} onSubmit={handleUpdate} noValidate>
        <div className={styles.formGrid}>
          {/* Campo Linha */}
          <div className={styles.inputGroup}>
            <label htmlFor="linhaId">Linha</label>
            <select name="linhaId" id="linhaId" value={formData.linhaId || ''} onChange={handleChange} required>
              <option value="">Selecione a linha...</option>
              {mockLinhas.map(linha => (
                <option key={linha.id} value={linha.id}>{linha.nome}</option>
              ))}
            </select>
          </div>

          {/* Campo Sentido */}
          <div className={styles.inputGroup}>
            <label htmlFor="sentido">Sentido</label>
            <select name="sentido" id="sentido" value={formData.sentido || ''} onChange={handleChange} required>
              <option value="">Selecione...</option>
              <option value="ida">Ida</option>
              <option value="volta">Volta</option>
              <option value="circular">Circular</option>
            </select>
          </div>

          {/* Campo Hora Início */}
          <div className={styles.inputGroup}>
            <label htmlFor="horaInicio">Hora de Início</label>
            <input name="horaInicio" id="horaInicio" type="time" value={formData.horaInicio || ''} onChange={handleChange} required />
          </div>

          {/* Campo Hora Fim */}
          <div className={styles.inputGroup}>
            <label htmlFor="horaFim">Hora de Fim</label>
            <input name="horaFim" id="horaFim" type="time" value={formData.horaFim || ''} onChange={handleChange} required />
          </div>

          {/* Campo Dia */}
          <div className={styles.inputGroup}>
            <label htmlFor="dia">Dia de Operação</label>
            <select name="dia" id="dia" value={formData.dia || ''} onChange={handleChange} required>
              <option value="">Selecione...</option>
              <option value="seg-sex">Segunda a Sexta</option>
              <option value="sab">Sábados</option>
              <option value="dom-fer">Domingos e Feriados</option>
            </select>
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

export default LinhaHorarioEdicao;
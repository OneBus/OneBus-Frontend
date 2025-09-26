import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './LinhaEdicao.module.css'; // Usando o CSS copiado

// Simula um "banco de dados" de onde buscaremos a linha para editar
const mockDatabase = [
  { id: 1, numero: '824EX1', nome: 'Pirapora Do Bom Jesus (Pq. Paiol) - Barueri (Centro)', tipo: 'intermunicipal' , tempoViagem: '01:10', quilometragem: '26.5', sentido: 'Volta' },
  { id: 2, numero: '082DV1', nome: 'Pirapora Do Bom Jesus (Jd.Bom Jesus Via Paiol)- Osasco (Vila-Yara)', tipo: 'intermunicipal', tempoViagem: '02:20', quilometragem: '49.6', sentido: 'Ida ' },
  { id: 3, numero: '467', nome: 'Santana de Parníba (Centro) - São Paulo (Lapa)', tipo: 'intermunicipal' , tempoViagem: '02:00', quilometragem: '39.8' ,sentido: 'Ida' },
  { id: 4, numero: '830-2', nome: 'Centro Parnaíba - Jaguari', tipo: 'municipal'  , tempoViagem: '01:30',quilometragem:'21.7', sentido: 'Circular'},

];

function LinhaEdicao() {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o ID da linha da URL

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  // Efeito para "buscar" os dados da linha quando a página carrega
  useEffect(() => {
    console.log("Procurando linha com ID:", id);
    // Encontra a linha no nosso "banco de dados" mock
    const lineData = mockDatabase.find(l => l.id === parseInt(id, 10));
    
    if (lineData) {
      setFormData(lineData);
    } else {
      console.error("Linha não encontrada no mock!");
    }
    setLoading(false);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log("Dados da linha atualizados:", formData);
    alert('Mockup: Alterações salvas no console!');
    navigate('/linha'); // Navega de volta para a lista
  };

  if (loading) return <p className={styles.container}>Carregando dados da linha...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Editar Linha: {formData.nome || '...'}</h1>
        <button onClick={() => navigate('/linha')} className={styles.backButton}>
          Voltar para a Lista
        </button>
      </div>
      
      <form className={styles.form} onSubmit={handleUpdate} noValidate>
        <div className={styles.formGrid}>
          {/* Campo Número */}
          <div className={styles.inputGroup}>
            <label htmlFor="numero">Número da Linha</label>
            <input name="numero" id="numero" type="text" value={formData.numero || ''} onChange={handleChange} required />
          </div>

          {/* Campo Nome */}
          <div className={styles.inputGroup}>
            <label htmlFor="nome">Nome da Linha</label>
            <input name="nome" id="nome" type="text" value={formData.nome || ''} onChange={handleChange} required />
          </div>

          {/* Campo Tipo */}
          <div className={styles.inputGroup}>
            <label htmlFor="tipo">Tipo</label>
            <select name="tipo" id="tipo" value={formData.tipo || ''} onChange={handleChange} required>
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
            <input name="tempoViagem" id="tempoViagem" type="time" value={formData.tempoViagem || ''} onChange={handleChange} />
          </div>

          {/* Campo Quilometragem */}
          <div className={styles.inputGroup}>
            <label htmlFor="quilometragem">Quilometragem (KM)</label>
            <input name="quilometragem" id="quilometragem" type="number" step="0.1" value={formData.quilometragem || ''} onChange={handleChange} />
          </div>

          {/* Campo Sentido */}
          <div className={styles.inputGroup}>
            <label htmlFor="sentido">Sentido</label>
            <select name="sentido" id="sentido" value={formData.sentido || ''} onChange={handleChange} required>
              <option value="">Selecione...</option>
              <option value="ida">Ida</option>
              <option value="volta">Volta</option>
              <option value="ida-volta">Ida e Volta</option>
              <option value="circular">Circular</option>
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

export default LinhaEdicao;
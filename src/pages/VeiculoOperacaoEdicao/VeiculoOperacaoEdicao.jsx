import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './VeiculoOperacaoEdicao.module.css'; // Usando o CSS copiado
import Modal from '../../components/Modal/Modal';

// Simula um "banco de dados" de onde buscaremos a operação para editar
const mockDatabase = [
  { id: 1, employeeId: '1', vehicleId: '1', lineId: '1', operationDate: '2025-10-20', startTime: '05:00', endTime: '14:00', linhaNome: '082 - PIRAPORA (JD. BOM JESUS)' },
  { id: 2, employeeId: '2', vehicleId: '2', lineId: '2', operationDate: '2025-10-20', startTime: '05:30', endTime: '14:30', linhaNome: '054 - CAJAMAR (JORDANESIA)' },
  { id: 3, employeeId: '3', vehicleId: '1', lineId: '1', operationDate: '2025-10-20', startTime: '14:00', endTime: '23:00', linhaNome: '082 - PIRAPORA (JD. BOM JESUS)' },
  { id: 4, employeeId: '1', vehicleId: '2', lineId: '2', operationDate: '2025-10-21', startTime: '14:30', endTime: '23:30', linhaNome: '054 - CAJAMAR (JORDANESIA)' }, // ID do Funcionário trocado para o teste
];

// Mock de dados para os selects (copiados da tela de cadastro)
const mockEmployees = [
    { id: 1, name: 'Bruno Berdinazzi Mezenga' },
    { id: 2, name: 'Guilherme Beserra' },
    { id: 3, name: 'Carlos Andrade' },
];
const mockVehicles = [
    { id: 1, prefix: '1001', model: 'Apache Vip IV' },
    { id: 2, prefix: '1002', model: 'Viale BRS' },
    { id: 3, prefix: '2005', model: 'Marcopolo Senior' },
];
const mockLines = [
    { id: 1, number: '082', name: 'PIRAPORA (JD. BOM JESUS)' },
    { id: 2, number: '054', name: 'CAJAMAR (JORDANESIA)' },
];

function VeiculoOperacaoEdicao() {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o ID da operação da URL

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ isOpen: false, message: '', isError: false });

  // Efeito para "buscar" os dados da operação quando a página carrega
  useEffect(() => {
    console.log("Procurando operação com ID:", id);
    // Encontra a operação no nosso "banco de dados" mock
    const operationData = mockDatabase.find(op => op.id === parseInt(id, 10));
    
    if (operationData) {
      setFormData(operationData);
    } else {
      console.error("Operação não encontrada no mock!");
    }
    setLoading(false);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("Dados da operação atualizados:", formData);
    // Simula a chamada da API
    setTimeout(() => {
      setLoading(false);
      setFeedback({ isOpen: true, message: 'Operação atualizada com sucesso!', isError: false });
    }, 1000);
  };

  const handleCloseModal = () => {
    setFeedback({ isOpen: false, message: '', isError: false });
    if (!feedback.isError) navigate('/veiculo-operacao');
  };

  if (loading) return <p className={styles.container}>Carregando dados da operação...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Editar Operação: Linha {formData.linhaNome || '...'}</h1>
        <button onClick={() => navigate('/veiculo-operacao')} className={styles.backButton}>
          Voltar para a Lista
        </button>
      </div>
      
      <form className={styles.form} onSubmit={handleUpdate} noValidate>
        <div className={styles.formGrid}>
          {/* Campo Funcionário */}
          <div className={styles.inputGroup}>
            <label htmlFor="employeeId">Funcionário</label>
            <select name="employeeId" id="employeeId" value={formData.employeeId || ''} onChange={handleChange} required>
              <option value="">Selecione o funcionário...</option>
              {mockEmployees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>

          {/* Campo Veículo */}
          <div className={styles.inputGroup}>
            <label htmlFor="vehicleId">Veículo</label>
            <select name="vehicleId" id="vehicleId" value={formData.vehicleId || ''} onChange={handleChange} required>
              <option value="">Selecione o veículo...</option>
              {mockVehicles.map(veh => (
                <option key={veh.id} value={veh.id}>{veh.prefix} - {veh.model}</option>
              ))}
            </select>
          </div>

          {/* Campo Linha */}
          <div className={styles.inputGroup}>
            <label htmlFor="lineId">Linha</label>
            <select name="lineId" id="lineId" value={formData.lineId || ''} onChange={handleChange} required>
              <option value="">Selecione a linha...</option>
              {mockLines.map(line => (
                <option key={line.id} value={line.id}>{line.number} - {line.name}</option>
              ))}
            </select>
          </div>

          {/* Campo Data da Operação */}
          <div className={styles.inputGroup}>
            <label htmlFor="operationDate">Data da Operação</label>
            <input name="operationDate" id="operationDate" type="date" value={formData.operationDate || ''} onChange={handleChange} required />
          </div>

          {/* Campo Hora de Início */}
          <div className={styles.inputGroup}>
            <label htmlFor="startTime">Hora de Início</label>
            <input name="startTime" id="startTime" type="time" value={formData.startTime || ''} onChange={handleChange} required />
          </div>

          {/* Campo Hora de Fim */}
          <div className={styles.inputGroup}>
            <label htmlFor="endTime">Hora de Fim</label>
            <input name="endTime" id="endTime" type="time" value={formData.endTime || ''} onChange={handleChange} required />
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
          <button onClick={handleCloseModal} className="feedback-modal-button">Fechar</button>
        </div>
      </Modal>
    </div>
  );
}

export default VeiculoOperacaoEdicao;
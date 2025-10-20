import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './VeiculoOperacaoCadastro.module.css'; // Usando o CSS copiado
import Modal from '../../components/Modal/Modal';

// Mock de dados para os selects
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

function VeiculoOperacaoCadastro() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employeeId: '',
    vehicleId: '',
    lineId: '',
    operationDate: '',
    startTime: '',
    endTime: '',
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ isOpen: false, message: '', isError: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true); // Simula o início do carregamento

    // Validação simples (pode ser aprimorada)
    if (!formData.employeeId || !formData.vehicleId || !formData.lineId || !formData.operationDate || !formData.startTime || !formData.endTime) {
      setFeedback({ isOpen: true, message: 'Todos os campos são obrigatórios.', isError: true });
      setLoading(false);
      return;
    }

    console.log("Dados da operação a serem salvos:", formData);
    // Simula a chamada da API
    setTimeout(() => {
      setLoading(false);
      setFeedback({ isOpen: true, message: 'Operação alocada com sucesso!', isError: false });
    }, 1000); // Espera 1 segundo
  };

  const handleCloseModal = () => {
    setFeedback({ isOpen: false, message: '', isError: false });
    if (!feedback.isError) navigate('/veiculo-operacao');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Alocar Nova Operação</h1>
        <button onClick={() => navigate('/veiculo-operacao')} className={styles.backButton}>
          Voltar para a Lista
        </button>
      </div>
      
      <form className={styles.form} onSubmit={handleSave} noValidate>
        <div className={styles.formGrid}>
          {/* Campo Funcionário */}
          <div className={styles.inputGroup}>
            <label htmlFor="employeeId">Funcionário</label>
            <select name="employeeId" id="employeeId" value={formData.employeeId} onChange={handleChange} required>
              <option value="">Selecione o funcionário...</option>
              {mockEmployees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>

          {/* Campo Veículo */}
          <div className={styles.inputGroup}>
            <label htmlFor="vehicleId">Veículo</label>
            <select name="vehicleId" id="vehicleId" value={formData.vehicleId} onChange={handleChange} required>
              <option value="">Selecione o veículo...</option>
              {mockVehicles.map(veh => (
                <option key={veh.id} value={veh.id}>{veh.prefix} - {veh.model}</option>
              ))}
            </select>
          </div>

          {/* Campo Linha */}
          <div className={styles.inputGroup}>
            <label htmlFor="lineId">Linha</label>
            <select name="lineId" id="lineId" value={formData.lineId} onChange={handleChange} required>
              <option value="">Selecione a linha...</option>
              {mockLines.map(line => (
                <option key={line.id} value={line.id}>{line.number} - {line.name}</option>
              ))}
            </select>
          </div>

          {/* Campo Data da Operação */}
          <div className={styles.inputGroup}>
            <label htmlFor="operationDate">Data da Operação</label>
            <input name="operationDate" id="operationDate" type="date" value={formData.operationDate} onChange={handleChange} required />
          </div>

          {/* Campo Hora de Início */}
          <div className={styles.inputGroup}>
            <label htmlFor="startTime">Hora de Início</label>
            <input name="startTime" id="startTime" type="time" value={formData.startTime} onChange={handleChange} required />
          </div>

          {/* Campo Hora de Fim */}
          <div className={styles.inputGroup}>
            <label htmlFor="endTime">Hora de Fim</label>
            <input name="endTime" id="endTime" type="time" value={formData.endTime} onChange={handleChange} required />
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.saveButton} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Alocação'}
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

export default VeiculoOperacaoCadastro;
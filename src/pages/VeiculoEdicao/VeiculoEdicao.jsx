import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './VeiculoEdicao.module.css';
import { getTodayDate } from '../../utils/validators';

// Simula um "banco de dados" de onde buscaremos o veículo para editar
const mockDatabase = [
  { id: 1, tipo: 'onibus', prefixo: '1001', numeroDePortas: '3', numeroDeAssentos: 45, acessibilidade: true, tipoCombustivel: 'Diesel', marca: 'Marcopolo', ano: 2022, placa: 'ABC-1234', cor: 'Azul', numeroCarroceria: 'MPL123', numeroChassi: 'CHASSI123', numeroDeEixos: '2', dataIpvaVencimento: '2025-10-20', licenciamentoVeiculo: '123456789', renavam: '987654321', tipoTransmissao: 'Automática', status: '1', servico: 'municipal', marcaChassi: 'Mercedes-Benz', modeloChassi: 'OF-1721', anoChassi: 2022, pisoBaixo: true, portasEsquerdas: false, seguroVencimento: '2025-12-01', detetizacao: '2025-11-15' },
  { id: 2, tipo: 'carro', prefixo: 'A-05', numeroDePortas: '4', numeroDeAssentos: 5, acessibilidade: false, tipoCombustivel: 'Flex', marca: 'Fiat', ano: 2023, placa: 'XYZ-5678', cor: 'Branco', numeroCarroceria: 'FIAT567', numeroChassi: 'CHASSI567', numeroDeEixos: '2', dataIpvaVencimento: '2025-04-10', licenciamentoVeiculo: '987654321', renavam: '123456789', tipoTransmissao: 'Manual', status: '1' },
];

function VeiculoEdicao() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const vehicleData = mockDatabase.find(v => v.id === parseInt(id, 10));
    if (vehicleData) {
      setFormData(vehicleData);
    } else {
      console.error("Veículo não encontrado no mock!");
    }
    setLoading(false);
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'radio' ? (value === 'true') : value;
    setFormData(prevState => ({ ...prevState, [name]: finalValue }));
  };
  
  const handleUpdate = (e) => {
    e.preventDefault();
    console.log("Dados do formulário atualizados:", formData);
    alert('Mockup: Alterações salvas no console!');
    navigate('/veiculo');
  };

  const showBusFields = formData.tipo === 'onibus' || formData.tipo === 'microonibus';

  if (loading) return <p className={styles.container}>Carregando dados do veículo...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Editar Veículo: {formData.placa || '...'}</h1>
        <button onClick={() => navigate('/veiculo')} className={styles.backButton}>
          Voltar para a Lista
        </button>
      </div>
      
      <form className={styles.form} onSubmit={handleUpdate} noValidate>
        <h2 className={styles.sectionTitle}>Informações Gerais</h2>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label>Tipo</label>
            <select name="tipo" value={formData.tipo || ''} onChange={handleChange} required>
              <option value="">Selecione...</option>
              <option value="onibus">Ônibus</option>
              <option value="microonibus">Micro-ônibus</option>
              <option value="carro">Carro</option>
              <option value="caminhao">Caminhão</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Prefixo</label>
            <input name="prefixo" type="text" value={formData.prefixo || ''} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Número de Portas</label>
            <select name="numeroDePortas" value={formData.numeroDePortas || ''} onChange={handleChange}>
              <option value="">Selecione...</option>
              <option value="1">1</option><option value="2">2</option><option value="3">3</option>
              <option value="4">4</option><option value="5">5</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Número de Assentos</label>
            <input name="numeroDeAssentos" type="number" value={formData.numeroDeAssentos || ''} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Tipo de Combustível</label>
            <input name="tipoCombustivel" type="text" value={formData.tipoCombustivel || ''} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Marca</label>
            <input name="marca" type="text" value={formData.marca || ''} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Ano</label>
            <input name="ano" type="number" placeholder="YYYY" value={formData.ano || ''} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Placa</label>
            <input name="placa" type="text" value={formData.placa || ''} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Cor</label>
            <input name="cor" type="text" value={formData.cor || ''} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Número da Carroceria</label>
            <input name="numeroCarroceria" type="text" value={formData.numeroCarroceria || ''} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Número do Chassi</label>
            <input name="numeroChassi" type="text" value={formData.numeroChassi || ''} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Número de Eixos</label>
            <select name="numeroDeEixos" value={formData.numeroDeEixos || ''} onChange={handleChange}>
              <option value="">Selecione...</option>
              <option value="1">1</option><option value="2">2</option><option value="3">3</option>
              <option value="4">4</option><option value="5">5</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Vencimento do IPVA</label>
            <input name="dataIpvaVencimento" type="date" value={formData.dataIpvaVencimento || ''} onChange={handleChange} min={getTodayDate()} />
          </div>
          <div className={styles.inputGroup}>
            <label>Licenciamento</label>
            <input name="licenciamentoVeiculo" type="text" value={formData.licenciamentoVeiculo || ''} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Renavam</label>
            <input name="renavam" type="text" value={formData.renavam || ''} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Tipo de Transmissão</label>
            <input name="tipoTransmissao" type="text" value={formData.tipoTransmissao || ''} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Status</label>
            <select name="status" value={formData.status || ''} onChange={handleChange}>
                <option value="">Selecione...</option>
                <option value="1">Ativo</option>
                <option value="0">Inativo</option>
            </select>
          </div>
          <div className={styles.inputGroupRadio}>
            <label>Acessibilidade</label>
            <div>
              <label><input type="radio" name="acessibilidade" value="true" checked={formData.acessibilidade === true} onChange={handleChange} /> Sim</label>
              <label><input type="radio" name="acessibilidade" value="false" checked={formData.acessibilidade === false} onChange={handleChange} /> Não</label>
            </div>
          </div>
        </div>

        {showBusFields && (
          <>
            <h2 className={styles.sectionTitle}>Informações Específicas de Ônibus</h2>
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label>Serviço</label>
                <select name="servico" value={formData.servico || ''} onChange={handleChange}>
                  <option value="">Selecione...</option>
                  <option value="intermunicipal">Intermunicipal</option>
                  <option value="suburbano">Suburbano</option>
                  <option value="municipal">Municipal</option>
                  <option value="seletivo">Seletivo</option>
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>Marca do Chassi</label>
                <input name="marcaChassi" type="text" value={formData.marcaChassi || ''} onChange={handleChange} />
              </div>
              <div className={styles.inputGroup}>
                <label>Modelo do Chassi</label>
                <input name="modeloChassi" type="text" value={formData.modeloChassi || ''} onChange={handleChange} />
              </div>
              <div className={styles.inputGroup}>
                <label>Ano do Chassi</label>
                <input name="anoChassi" type="number" placeholder="YYYY" value={formData.anoChassi || ''} onChange={handleChange} />
              </div>
              <div className={styles.inputGroup}>
                <label>Vencimento do Seguro</label>
                <input name="seguroVencimento" type="date" value={formData.seguroVencimento || ''} onChange={handleChange} />
              </div>
              <div className={styles.inputGroup}>
                <label>Próxima Detetização</label>
                <input name="detetizacao" type="date" value={formData.detetizacao || ''} onChange={handleChange} />
              </div>
              <div className={styles.inputGroupRadio}>
                <label>Piso Baixo</label>
                <div>
                  <label><input type="radio" name="pisoBaixo" value="true" checked={formData.pisoBaixo === true} onChange={handleChange} /> Sim</label>
                  <label><input type="radio" name="pisoBaixo" value="false" checked={formData.pisoBaixo === false} onChange={handleChange} /> Não</label>
                </div>
              </div>
              <div className={styles.inputGroupRadio}>
                <label>Portas à Esquerda</label>
                <div>
                  <label><input type="radio" name="portasEsquerdas" value="true" checked={formData.portasEsquerdas === true} onChange={handleChange} /> Sim</label>
                  <label><input type="radio" name="portasEsquerdas" value="false" checked={formData.portasEsquerdas === false} onChange={handleChange} /> Não</label>
                </div>
              </div>
            </div>
          </>
        )}

        <div className={styles.actions}>
          <button type="submit" className={styles.saveButton}>
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
}

export default VeiculoEdicao;
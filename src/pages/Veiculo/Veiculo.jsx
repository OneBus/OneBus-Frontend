import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Veiculo.module.css'; // Usando o CSS copiado
import api from '../../services/api';
import { getTodayDate } from '../../utils/validators';

function VeiculoCadastro() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Campos principais
    tipo: '',
    prefixo: '',
    numeroDePortas: '',
    numeroDeAssentos: '',
    acessibilidade: false,
    tipoCombustivel: '',
    marca: '',
    ano: '',
    placa: '',
    cor: '',
    numeroCarroceria: '',
    numeroChassi: '',
    numeroDeEixos: '',
    dataIpvaVencimento: '',
    licenciamentoVeiculo: '',
    renavam: '',
    tipoTransmissao: '',
    status: '',
    // Campos específicos de ônibus
    servico: '',
    marcaChassi: '',
    modeloChassi: '',
    anoChassi: '',
    pisoBaixo: false,
    portasEsquerdas: false,
    seguroVencimento: '',
    detetizacao: '',
  });

  const [statusOptions, setStatusOptions] = useState([]);

  // Efeito para buscar as opções de status
  useEffect(() => {
    const fetchStatusOptions = async () => {
      try {
        const response = await api.get('/employees/status'); // Reutilizando endpoint de status
        setStatusOptions(response.data.value || []);
      } catch (err) {
        console.error("Erro ao buscar opções de status:", err);
      }
    };
    fetchStatusOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Lógica para lidar com radio buttons e outros campos
    const finalValue = type === 'checkbox' || type === 'radio' ? checked : value;
    setFormData(prevState => ({ ...prevState, [name]: finalValue }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Dados do formulário a serem salvos:", formData);
    // Aqui viria a lógica de chamada da API
    alert('Mockup: Dados salvos no console!');
    navigate('/veiculo'); // Navega de volta para a lista (rota de exemplo)
  };

  // Variável que controla a exibição dos campos de ônibus
  const showBusFields = formData.tipo === 'onibus' || formData.tipo === 'microonibus';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Cadastrar Novo Veículo</h1>
        <button onClick={() => navigate('/veiculo')} className={styles.backButton}>
          Voltar para a Lista
        </button>
      </div>
      
      <form className={styles.form} onSubmit={handleSave} noValidate>
        {/* --- SEÇÃO DE CAMPOS GERAIS --- */}
        <h2 className={styles.sectionTitle}>Informações Gerais</h2>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label>Tipo</label>
            <select name="tipo" value={formData.tipo} onChange={handleChange} required>
              <option value="">Selecione...</option>
              <option value="onibus">Ônibus</option>
              <option value="microonibus">Micro-ônibus</option>
              <option value="carro">Carro</option>
              <option value="caminhao">Caminhão</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Prefixo</label>
            <input name="prefixo" type="text" value={formData.prefixo} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Número de Portas</label>
            <select name="numeroDePortas" value={formData.numeroDePortas} onChange={handleChange}>
              <option value="">Selecione...</option>
              <option value="1">1</option><option value="2">2</option><option value="3">3</option>
              <option value="4">4</option><option value="5">5</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Número de Assentos</label>
            <input name="numeroDeAssentos" type="number" value={formData.numeroDeAssentos} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Tipo de Combustível</label>
            <input name="tipoCombustivel" type="text" value={formData.tipoCombustivel} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Marca</label>
            <input name="marca" type="text" value={formData.marca} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Ano</label>
            <input name="ano" type="number" placeholder="YYYY" value={formData.ano} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Placa</label>
            <input name="placa" type="text" value={formData.placa} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Cor</label>
            <input name="cor" type="text" value={formData.cor} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Número da Carroceria</label>
            <input name="numeroCarroceria" type="text" value={formData.numeroCarroceria} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Número do Chassi</label>
            <input name="numeroChassi" type="text" value={formData.numeroChassi} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Número de Eixos</label>
            <select name="numeroDeEixos" value={formData.numeroDeEixos} onChange={handleChange}>
              <option value="">Selecione...</option>
              <option value="1">1</option><option value="2">2</option><option value="3">3</option>
              <option value="4">4</option><option value="5">5</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Vencimento do IPVA</label>
            <input name="dataIpvaVencimento" type="date" value={formData.dataIpvaVencimento} onChange={handleChange} min={getTodayDate()} />
          </div>
          <div className={styles.inputGroup}>
            <label>Licenciamento</label>
            <input name="licenciamentoVeiculo" type="text" value={formData.licenciamentoVeiculo} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Renavam</label>
            <input name="renavam" type="text" value={formData.renavam} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Tipo de Transmissão</label>
            <input name="tipoTransmissao" type="text" value={formData.tipoTransmissao} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
                <option value="">Selecione...</option>
                {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
            </select>
          </div>
          <div className={styles.inputGroupRadio}>
            <label>Acessibilidade</label>
            <div>
              <label><input type="radio" name="acessibilidade" checked={formData.acessibilidade === true} onChange={() => setFormData({...formData, acessibilidade: true})} /> Sim</label>
              <label><input type="radio" name="acessibilidade" checked={formData.acessibilidade === false} onChange={() => setFormData({...formData, acessibilidade: false})} /> Não</label>
            </div>
          </div>
        </div>

        {/* --- SEÇÃO CONDICIONAL PARA ÔNIBUS/MICRO-ÔNIBUS --- */}
        {showBusFields && (
          <>
            <h2 className={styles.sectionTitle}>Informações Específicas de Ônibus</h2>
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label>Serviço</label>
                <select name="servico" value={formData.servico} onChange={handleChange}>
                  <option value="">Selecione...</option>
                  <option value="intermunicipal">Intermunicipal</option>
                  <option value="suburbano">Suburbano</option>
                  <option value="municipal">Municipal</option>
                  <option value="seletivo">Seletivo</option>
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>Marca do Chassi</label>
                <input name="marcaChassi" type="text" value={formData.marcaChassi} onChange={handleChange} />
              </div>
              <div className={styles.inputGroup}>
                <label>Modelo do Chassi</label>
                <input name="modeloChassi" type="text" value={formData.modeloChassi} onChange={handleChange} />
              </div>
              <div className={styles.inputGroup}>
                <label>Ano do Chassi</label>
                <input name="anoChassi" type="number" placeholder="YYYY" value={formData.anoChassi} onChange={handleChange} />
              </div>
              <div className={styles.inputGroup}>
                <label>Vencimento do Seguro</label>
                <input name="seguroVencimento" type="date" value={formData.seguroVencimento} onChange={handleChange} />
              </div>
              <div className={styles.inputGroup}>
                <label>Próxima Detetização</label>
                <input name="detetizacao" type="date" value={formData.detetizacao} onChange={handleChange} />
              </div>
              <div className={styles.inputGroupRadio}>
                <label>Piso Baixo</label>
                <div>
                  <label><input type="radio" name="pisoBaixo" checked={formData.pisoBaixo === true} onChange={() => setFormData({...formData, pisoBaixo: true})} /> Sim</label>
                  <label><input type="radio" name="pisoBaixo" checked={formData.pisoBaixo === false} onChange={() => setFormData({...formData, pisoBaixo: false})} /> Não</label>
                </div>
              </div>
              <div className={styles.inputGroupRadio}>
                <label>Portas à Esquerda</label>
                <div>
                  <label><input type="radio" name="portasEsquerdas" checked={formData.portasEsquerdas === true} onChange={() => setFormData({...formData, portasEsquerdas: true})} /> Sim</label>
                  <label><input type="radio" name="portasEsquerdas" checked={formData.portasEsquerdas === false} onChange={() => setFormData({...formData, portasEsquerdas: false})} /> Não</label>
                </div>
              </div>
            </div>
          </>
        )}

        <div className={styles.actions}>
          <button type="submit" className={styles.saveButton}>
            Salvar Veículo
          </button>
        </div>
      </form>
    </div>
  );
}

export default VeiculoCadastro;
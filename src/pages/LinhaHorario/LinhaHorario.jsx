import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LinhaHorario.module.css';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import api from '../../services/api';
import Modal from '../../components/Modal/Modal';
import { generatePageNumbers } from '../../utils/pagination';

// Hook de Debounce
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

function LinhaHorario() {
  const navigate = useNavigate();

  // Estados da página
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [horarioToDelete, setHorarioToDelete] = useState(null);

  // Estados para filtros e paginação
  const [filters, setFilters] = useState({ value: '', lineId: '', dayType: '' });
  const [pagination, setPagination] = useState({
    currentPage: 0, pageSize: 10, totalPages: 0, hasNextPage: false, hasPreviousPage: false,
  });
  
  // Estados para popular os dropdowns de filtro
  const [lineOptions, setLineOptions] = useState([]);
  const [dayTypeOptions, setDayTypeOptions] = useState([]);

  const debouncedSearchTerm = useDebounce(filters.value, 500);

  // Efeito para buscar as opções dos filtros (Linhas e Tipos de Dia)
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [linesRes, dayTypesRes] = await Promise.all([
          api.get('/lines', { params: { PageSize: 1000 } }), // Busca todas as linhas
          api.get('/linesTimes/daysTypes') // Endpoint para tipos de dia
        ]);
        
        setLineOptions(linesRes.data.value.items || []);
        setDayTypeOptions(dayTypesRes.data.value || []);
      } catch (err) {
        console.error("Erro ao buscar opções de filtro:", err);
      }
    };
    fetchFilterOptions();
  }, []);

  // Função principal para buscar os horários das linhas
  const fetchLinhaHorarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        CurrentPage: pagination.currentPage + 1,
        PageSize: pagination.pageSize,
        Value: debouncedSearchTerm || null, // Filtro genérico
        LineId: filters.lineId || null,
        DayType: filters.dayType || null,
      };

      const response = await api.get('/linesTimes', { params });
      
      const { items, totalPages, currentPage, hasNextPage, hasPreviousPage } = response.data.value;
      setHorarios(items);
      setPagination(prev => ({ ...prev, totalPages, currentPage: currentPage - 1, hasNextPage, hasPreviousPage }));

    } catch (err) {
      setError('Não foi possível carregar os horários das linhas.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.pageSize, debouncedSearchTerm, filters]);

  useEffect(() => {
    fetchLinhaHorarios();
  }, [fetchLinhaHorarios]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, currentPage: 0 }));
  };
  
  const handlePageSizeChange = (e) => {
    setPagination(prev => ({ ...prev, pageSize: parseInt(e.target.value, 10), currentPage: 0 }));
  };

  const handleCadastrarClick = () => navigate('/linha-horario/cadastrar');
  const handleEditClick = (id) => navigate(`/linha-horario/editar/${id}`);
  const handleDeleteClick = (horario) => setHorarioToDelete(horario);

  const handleConfirmDelete = async () => {
    if (!horarioToDelete) return;
    try {
      // ATENÇÃO: Verifique o endpoint correto para deletar um horário de linha
      await api.delete(`/linesTimes/${horarioToDelete.id}`);
      fetchLinhaHorarios(); // Atualiza a lista
      setHorarioToDelete(null);
    } catch(err) {
      setError("Não foi possível deletar o horário.");
      setHorarioToDelete(null);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  // Função para formatar a hora (igual à da tela FuncionarioHorario)
  const formatTime = (timeString) => {
    if (!timeString) return '--:--';
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('pt-BR', {
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <h1>Horários das Linhas</h1>
        <button className={styles.cadastrarBtn} onClick={handleCadastrarClick}>
          Cadastrar Horário
        </button>
      </div>
      
      <div className={styles.filterBar}>
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input name="value" type="text" placeholder="Pesquisar..." value={filters.value} onChange={handleFilterChange} className={styles.searchInput}/>
        </div>
        {/* Filtro de Linha dinâmico */}
        <select name="lineId" value={filters.lineId} onChange={handleFilterChange} className={styles.filterSelect}>
          <option value="">Todas as Linhas</option>
          {lineOptions.map(line => <option key={line.id} value={line.id}>{line.number} - {line.name}</option>)}
        </select>
        {/* Filtro de Dia dinâmico */}
        <select name="dayType" value={filters.dayType} onChange={handleFilterChange} className={styles.filterSelect}>
          <option value="">Todos os Dias</option>
          {dayTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
        </select>
        <select name="pageSize" value={pagination.pageSize} onChange={handlePageSizeChange} className={styles.filterSelect}>
          <option value="10">10 por página</option>
          <option value="20">20 por página</option>
          <option value="50">50 por página</option>
        </select>
      </div>

      <div className={styles.tableContainer}>
        {loading ? ( <p className={styles.message}>Carregando...</p> ) : error ? ( <p className={styles.messageError}>{error}</p> ) : (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Linha</th>
                  <th>Hora Viagem</th>
                  <th>Dia</th>
                  <th>Sentido</th> {/* Coluna adicionada conforme API */}
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {horarios.length > 0 ? (
                  horarios.map((horario) => (
                    <tr key={horario.id}>
                      <td>{horario.lineNumber} - {horario.lineName}</td>
                      <td>{formatTime(horario.time)}</td>
                      <td>{horario.dayTypeName}</td>
                      <td>{horario.directionTypeName}</td> {/* Campo adicionado */}
                      <td className={styles.actionIcons}>
                        <FaEdit title="Editar" onClick={() => handleEditClick(horario.id)} />
                        <FaTrash title="Excluir" onClick={() => handleDeleteClick(horario)} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className={styles.message}>Nenhum horário encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {pagination.totalPages > 1 && (
              <div className={styles.pagination}>
                 {/* ... (código da paginação) ... */}
              </div>
            )}
          </>
        )}
      </div>

      <Modal isOpen={!!horarioToDelete} onClose={() => setHorarioToDelete(null)}>
        <div className="logout-modal-content">
          <h3>Confirmar Exclusão</h3>
          <p>
            Tem certeza que deseja excluir o horário das {formatTime(horarioToDelete?.time)} da linha 
            <strong> {horarioToDelete?.lineName}</strong>?
          </p>
          <div className="logout-modal-buttons">
            <button className="btn-cancel" onClick={() => setHorarioToDelete(null)}>Cancelar</button>
            <button className="btn-confirm" onClick={handleConfirmDelete}>Sim, Excluir</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default LinhaHorario;
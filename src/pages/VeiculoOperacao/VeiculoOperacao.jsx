import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './VeiculoOperacao.module.css';
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

// Função para formatar a hora
const formatTime = (timeString) => {
  if (!timeString) return '--:--';
  return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('pt-BR', {
    hour: '2-digit', minute: '2-digit'
  });
};

function VeiculoOperacao() {
  const navigate = useNavigate();

  // Estados da página
  const [operacoes, setOperacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationToDelete, setOperationToDelete] = useState(null);

  // Estados para filtros e paginação
  const [filters, setFilters] = useState({
    value: '',
    lineId: '',
    employeeId: '',
    vehicleId: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 0, pageSize: 10, totalPages: 0, hasNextPage: false, hasPreviousPage: false,
  });
  
  // Estados para popular os dropdowns de filtro
  const [lineOptions, setLineOptions] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [vehicleOptions, setVehicleOptions] = useState([]);

  const debouncedSearchTerm = useDebounce(filters.value, 500);

  // Efeito para buscar as opções dos filtros (Linhas, Funcionários, Veículos)
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [linesRes, employeesRes, vehiclesRes] = await Promise.all([
          api.get('/lines', { params: { PageSize: 1000 } }),
          api.get('/employees', { params: { PageSize: 1000 } }),
          api.get('/vehicles', { params: { PageSize: 1000 } }),
        ]);
        
        setLineOptions(linesRes.data.value.items || []);
        setEmployeeOptions(employeesRes.data.value.items || []);
        setVehicleOptions(vehiclesRes.data.value.items || []);
      } catch (err) {
        console.error("Erro ao buscar opções de filtro:", err);
      }
    };
    fetchFilterOptions();
  }, []);

  // Função principal para buscar as operações
  const fetchOperacoes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // ATENÇÃO: Verifique os nomes dos parâmetros de filtro (LineId, EmployeeId, etc.)
      const params = {
        CurrentPage: pagination.currentPage + 1,
        PageSize: pagination.pageSize,
        Value: debouncedSearchTerm || null,
        LineId: filters.lineId || null,
        EmployeeId: filters.employeeId || null,
        VehicleId: filters.vehicleId || null,
      };

      const response = await api.get('/vehiclesOperations', { params });
      
      const { items, totalPages, currentPage, hasNextPage, hasPreviousPage } = response.data.value;
      setOperacoes(items);
      setPagination(prev => ({ ...prev, totalPages, currentPage: currentPage - 1, hasNextPage, hasPreviousPage }));

    } catch (err) {
      setError('Não foi possível carregar as operações.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.pageSize, debouncedSearchTerm, filters]);

  useEffect(() => {
    fetchOperacoes();
  }, [fetchOperacoes]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, currentPage: 0 }));
  };

  const handlePageSizeChange = (e) => {
    setPagination(prev => ({ ...prev, pageSize: parseInt(e.target.value, 10), currentPage: 0 }));
  };

  const handleCadastrarClick = () => navigate('/veiculo-operacao/cadastrar');
  const handleEditClick = (id) => navigate(`/veiculo-operacao/editar/${id}`);
  const handleDeleteClick = (operation) => setOperationToDelete(operation);

  const handleConfirmDelete = async () => {
    if (!operationToDelete) return;
    try {
      await api.delete(`/vehiclesOperations/${operationToDelete.id}`);
      fetchOperacoes();
      setOperationToDelete(null);
    } catch(err) {
      setError("Não foi possível deletar a operação.");
      setOperationToDelete(null);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <h1>Operações de Veículos</h1>
        <button className={styles.cadastrarBtn} onClick={handleCadastrarClick}>
          Criar Operação
        </button>
      </div>
      
      <div className={styles.filterBar}>
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input name="value" type="text" placeholder="Pesquisar..." value={filters.value} onChange={handleFilterChange} className={styles.searchInput}/>
        </div>
        {/* Filtro de Linha */}
        <select name="lineId" value={filters.lineId} onChange={handleFilterChange} className={styles.filterSelect}>
          <option value="">Todas as Linhas</option>
          {lineOptions.map(line => (
            <option key={line.id} value={line.id}>{line.number} - {line.name}</option>
          ))}
        </select>
        {/* Filtro de Funcionário */}
        <select name="employeeId" value={filters.employeeId} onChange={handleFilterChange} className={styles.filterSelect}>
          <option value="">Todos os Funcionários</option>
          {employeeOptions.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>
        {/* Filtro de Veículo */}
        <select name="vehicleId" value={filters.vehicleId} onChange={handleFilterChange} className={styles.filterSelect}>
          <option value="">Todos os Veículos</option>
          {vehicleOptions.map(veh => (
            <option key={veh.id} value={veh.id}>{veh.prefix} - {veh.model}</option>
          ))}
        </select>
        {/* Seletor de Itens por Página */}
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
                  <th>Funcionário</th>
                  <th>Veículo</th>
                  <th>Hora Início</th>
                  <th>Hora Fim</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {operacoes.length > 0 ? (
                  operacoes.map((op) => (
                    <tr key={op.id}>
                      <td>{op.lineNumber} - {op.lineName}</td>
                      <td className={styles.user}>
                        <img
                          src={op.employeeImage ? `data:image/png;base64,${op.employeeImage}` : `https://ui-avatars.com/api/?name=${op.employeeName}&background=random`}
                          alt={`Foto de ${op.employeeName}`}
                          className={styles.userAvatar}
                        />
                        {op.employeeName}
                      </td>
                      <td>{op.vehiclePrefix} - {op.vehicleTypeName}</td>
                      <td>{formatTime(op.employeeWorkdayStartTime)}</td>
                      <td>{formatTime(op.employeeWorkdayEndTime)}</td>
                      <td className={styles.actionIcons}>
                        <FaEdit title="Editar" onClick={() => handleEditClick(op.id)} />
                        <FaTrash title="Excluir" onClick={() => handleDeleteClick(op)} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className={styles.message}>Nenhuma operação encontrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {pagination.totalPages > 1 && (
              <div className={styles.pagination}>
                 <button 
                  onClick={() => handlePageChange(pagination.currentPage - 1)} 
                  disabled={!pagination.hasPreviousPage}
                  className={styles.pageButton}
                >
                  &lt; Anterior
                </button>
                <div className={styles.pageNumbers}>
                  {generatePageNumbers(pagination.currentPage, pagination.totalPages).map(pageNumber => (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`${styles.pageButton} ${pagination.currentPage === pageNumber ? styles.activePage : ''}`}
                    >
                      {pageNumber + 1}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => handlePageChange(pagination.currentPage + 1)} 
                  disabled={!pagination.hasNextPage}
                  className={styles.pageButton}
                >
                  Próximo &gt;
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Modal isOpen={!!operationToDelete} onClose={() => setOperationToDelete(null)}>
            <div className="logout-modal-content">
          <h3>Confirmar Exclusão</h3>
          <p>
            Tem certeza que deseja excluir o veículo de prefixo
            <strong> {handleConfirmDelete?.prefix}</strong>?
          </p>
          <div className="logout-modal-buttons">
            <button className="btn-cancel" onClick={() =>setOperationToDelete(null)}>Cancelar</button>
            <button className="btn-confirm" onClick={handleConfirmDelete}>Sim, Excluir</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default VeiculoOperacao;
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Manutencao.module.css';
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

// Função para formatar data e hora
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return 'N/A';
  try {
    const date = new Date(dateTimeString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  } catch (e) {
    return 'Data inválida';
  }
};

// Função para formatar apenas data
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString + 'T00:00:00'); // Adiciona T00:00:00 para evitar problemas de fuso
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    } catch (e) {
        return 'Data inválida';
    }
};


function Manutencao() {
  const navigate = useNavigate();

  const [manutencoes, setManutencoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [manutencaoToDelete, setManutencaoToDelete] = useState(null);

  const [filters, setFilters] = useState({ value: '', sector: '' });
  const [pagination, setPagination] = useState({
    currentPage: 0, pageSize: 10, totalPages: 0, hasNextPage: false, hasPreviousPage: false,
  });
  
  const [sectorOptions, setSectorOptions] = useState([]);
  const debouncedSearchTerm = useDebounce(filters.value, 500);

  // Efeito para buscar as opções dos filtros (Setores)
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // ATENÇÃO: Verifique o endpoint correto para buscar os setores
        const response = await api.get('/maintenances/sectors'); 
        setSectorOptions(response.data.value || []);
      } catch (err) {
        console.error("Erro ao buscar setores:", err);
      }
    };
    fetchFilterOptions();
  }, []);

  // Função principal para buscar as manutenções
  const fetchManutencoes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        CurrentPage: pagination.currentPage + 1,
        PageSize: pagination.pageSize,
        Value: debouncedSearchTerm || null,
        Sector: filters.sector || null, // Parâmetro de filtro para setor
      };

      const response = await api.get('/maintenances', { params });
      
      const { items, totalPages, currentPage, hasNextPage, hasPreviousPage } = response.data.value;
      setManutencoes(items);
      setPagination(prev => ({ ...prev, totalPages, currentPage: currentPage - 1, hasNextPage, hasPreviousPage }));

    } catch (err) {
      setError('Não foi possível carregar as manutenções.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.pageSize, debouncedSearchTerm, filters.sector]);

  useEffect(() => {
    fetchManutencoes();
  }, [fetchManutencoes]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, currentPage: 0 }));
  };
  
  const handlePageSizeChange = (e) => {
    setPagination(prev => ({ ...prev, pageSize: parseInt(e.target.value, 10), currentPage: 0 }));
  };

  const handleCadastrarClick = () => navigate('/manutencao/cadastrar');
  const handleEditClick = (id) => navigate(`/manutencao/editar/${id}`);
  const handleDeleteClick = (manutencao) => setManutencaoToDelete(manutencao);

  const handleConfirmDelete = async () => {
    if (!manutencaoToDelete) return;
    try {
      // ATENÇÃO: Verifique o endpoint correto para deletar
      await api.delete(`/maintenances/${manutencaoToDelete.id}`); 
      fetchManutencoes();
      setManutencaoToDelete(null);
    } catch(err) {
      setError("Não foi possível deletar a manutenção.");
      setManutencaoToDelete(null);
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
        <h1>Manutenções</h1>
        <button className={styles.cadastrarBtn} onClick={handleCadastrarClick}>
          Agendar Manutenção
        </button>
      </div>
      
      <div className={styles.filterBar}>
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input name="value" type="text" placeholder="Pesquisar por descrição..." value={filters.value} onChange={handleFilterChange} className={styles.searchInput}/>
        </div>
        <select name="sector" value={filters.sector} onChange={handleFilterChange} className={styles.filterSelect}>
          <option value="">Todos os Setores</option>
          {sectorOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
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
                  <th>Prefixo</th>
                  <th>Setor</th>
                  <th>Descrição</th>
                  <th>Data Início</th>
                  <th>Data Fim</th>
                  <th>Venc. Vistoria</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {manutencoes.length > 0 ? (
                  manutencoes.map((item) => (
                    <tr key={item.id}>
                      <td>{item.vehiclePrefix}</td>
                      <td>{item.sectorName}</td>
                      <td>{item.description}</td>
                      <td>{formatDateTime(item.startDate)}</td>
                      <td>{formatDateTime(item.endDate)}</td>
                      <td>{formatDate(item.surveyExpiration)}</td>
                      <td className={styles.actionIcons}>
                        <FaEdit title="Editar" onClick={() => handleEditClick(item.id)} />
                        <FaTrash title="Excluir" onClick={() => handleDeleteClick(item)} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className={styles.message}>Nenhuma manutenção encontrada.</td>
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

      <Modal isOpen={!!manutencaoToDelete} onClose={() => setManutencaoToDelete(null)}>
        <div className="logout-modal-content">
          <h3>Confirmar Exclusão</h3>
          <p>
            Tem certeza que deseja excluir o agendamento: 
            <strong> {manutencaoToDelete?.description}</strong>?
          </p>
          <div className="logout-modal-buttons">
            <button className="btn-cancel" onClick={() => setManutencaoToDelete(null)}>Cancelar</button>
            <button className="btn-confirm" onClick={handleConfirmDelete}>Sim, Excluir</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Manutencao;
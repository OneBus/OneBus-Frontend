import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Linha.module.css';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import api from '../../services/api';
import Modal from '../../components/Modal/Modal';
import { generatePageNumbers } from '../../utils/pagination';

// Hook de Debounce para otimizar a busca
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

function Linha() {
  const navigate = useNavigate();

  // Estados da página
  const [linhas, setLinhas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lineToDelete, setLineToDelete] = useState(null);

  // Estados para filtros e paginação
  const [filters, setFilters] = useState({ value: '', type: '', directionType: '' });
  const [pagination, setPagination] = useState({
    currentPage: 0, pageSize: 10, totalPages: 0, hasNextPage: false, hasPreviousPage: false,
  });
  
  // Estados para popular os dropdowns de filtro
  const [typeOptions, setTypeOptions] = useState([]);
  const [directionTypeOptions, setDirectionTypeOptions] = useState([]);

  const debouncedSearchTerm = useDebounce(filters.value, 500);

  // Efeito para buscar as opções dos filtros (Tipos e Sentidos)
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [typesRes, directionsRes] = await Promise.all([
          api.get('/lines/types'),
          api.get('/lines/directionTypes'),
        ]);
        
        setTypeOptions(typesRes.data.value || []);
        setDirectionTypeOptions(directionsRes.data.value || []);
      } catch (err) {
        console.error("Erro ao buscar opções de filtro:", err);
      }
    };
    fetchFilterOptions();
  }, []);

  // Função principal para buscar as linhas
  const fetchLinhas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        CurrentPage: pagination.currentPage + 1,
        PageSize: pagination.pageSize,
        Value: debouncedSearchTerm || null,
        Type: filters.type || null,
        DirectionType: filters.directionType || null,
      };

      const response = await api.get('/lines', { params });
      
      const { items, totalPages, currentPage, hasNextPage, hasPreviousPage } = response.data.value;
      setLinhas(items);
      setPagination(prev => ({ ...prev, totalPages, currentPage: currentPage - 1, hasNextPage, hasPreviousPage }));

    } catch (err) {
      setError('Não foi possível carregar as linhas.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.pageSize, debouncedSearchTerm, filters]);

  useEffect(() => {
    fetchLinhas();
  }, [fetchLinhas]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, currentPage: 0 }));
  };
  
  const handlePageSizeChange = (e) => {
    setPagination(prev => ({ ...prev, pageSize: parseInt(e.target.value, 10), currentPage: 0 }));
  };

  const handleCadastrarClick = () => navigate('/linha/cadastrar');
  const handleEditClick = (id) => navigate(`/linha/editar/${id}`);
  const handleDeleteClick = (line) => setLineToDelete(line);

  const handleConfirmDelete = async () => {
    if (!lineToDelete) return;
    try {
      await api.delete(`/lines/${lineToDelete.id}`);
      fetchLinhas();
      setLineToDelete(null);
    } catch(err) {
      setError("Não foi possível deletar a linha.");
      setLineToDelete(null);
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
        <h1>Linhas</h1>
        <button className={styles.cadastrarBtn} onClick={handleCadastrarClick}>
          Cadastrar Linha
        </button>
      </div>
      
      <div className={styles.filterBar}>
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input name="value" type="text" placeholder="Pesquisar por nome ou número..." value={filters.value} onChange={handleFilterChange} className={styles.searchInput}/>
        </div>
        <select name="type" value={filters.type} onChange={handleFilterChange} className={styles.filterSelect}>
          <option value="">Todos os Tipos</option>
          {typeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
        </select>
        <select name="directionType" value={filters.directionType} onChange={handleFilterChange} className={styles.filterSelect}>
          <option value="">Todos os Sentidos</option>
          {directionTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
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
                  <th>Número</th>
                  <th>Nome</th>
                  <th>Tipo</th>
                  <th>Sentido</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {linhas.length > 0 ? (
                  linhas.map((linha) => (
                    <tr key={linha.id}>
                      {/* ATENÇÃO: Os nomes (ex: linha.number) devem corresponder ao que a API retorna */}
                      <td>{linha.number}</td>
                      <td>{linha.name}</td>
                      <td>{linha.typeName}</td>
                      <td>{linha.directionTypeName}</td>
                      <td className={styles.actionIcons}>
                        <FaEdit title="Editar" onClick={() => handleEditClick(linha.id)} />
                        <FaTrash title="Excluir" onClick={() => handleDeleteClick(linha)} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className={styles.message}>Nenhuma linha encontrada.</td>
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

      <Modal isOpen={!!lineToDelete} onClose={() => setLineToDelete(null)}>
        <div className="logout-modal-content">
          <h3>Confirmar Exclusão</h3>
          <p>
            Tem certeza que deseja excluir a linha 
            <strong> {lineToDelete?.name}</strong>?
          </p>
          <div className="logout-modal-buttons">
            <button className="btn-cancel" onClick={() => setLineToDelete(null)}>Cancelar</button>
            <button className="btn-confirm" onClick={handleConfirmDelete}>Sim, Excluir</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Linha;
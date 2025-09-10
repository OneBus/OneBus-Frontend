import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Funcionario.module.css';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import api from '../../services/api';
import Modal from '../../components/Modal/Modal';

// Hook de Debounce
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

function Funcionario() {
  const navigate = useNavigate();

  // Estados da página
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  // Estados para filtros, paginação e ordenação
  const [filters, setFilters] = useState({
    value: '',
    status: '',
    role: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    pageSize: 10,
  });
  
  // Estados para popular os dropdowns de filtro
  const [statusOptions, setStatusOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);

  const debouncedSearchTerm = useDebounce(filters.value, 500);

  // Efeito para buscar as opções dos filtros (status, cargos, etc.)
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [statusRes, rolesRes] = await Promise.all([
          api.get('/employees/status'),
          api.get('/employees/roles'),
        ]);
        
        // --- CORREÇÃO APLICADA AQUI ---
        // Extraímos o array de dentro da chave 'value'
        setStatusOptions(statusRes.data.value || []);
        setRoleOptions(rolesRes.data.value || []);
        // -----------------------------

      } catch (err) {
        console.error("Erro ao buscar opções de filtro:", err);
      }
    };
    fetchFilterOptions();
  }, []);

  // Função principal para buscar os funcionários
  const fetchFuncionarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        CurrentPage: pagination.currentPage + 1,
        PageSize: pagination.pageSize,
        Value: debouncedSearchTerm || null,
        Status: filters.status || null,
        Role: filters.role || null,
      };

      const response = await api.get('/employees', { params });
      
      const { items, totalPages } = response.data.value;
      setFuncionarios(items);
      setPagination(prev => ({ ...prev, totalPages }));

    } catch (err) {
      setError('Não foi possível carregar os funcionários.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.pageSize, debouncedSearchTerm, filters.status, filters.role]);

  useEffect(() => {
    fetchFuncionarios();
  }, [fetchFuncionarios]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, currentPage: 0 }));
  };
  
  const handleCadastrarClick = () => navigate('/funcionarios/cadastrar');
  const handleEditClick = (id) => navigate(`/funcionarios/editar/${id}`);
  const handleDeleteClick = (employee) => setEmployeeToDelete(employee);

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;
    try {
      await api.delete(`/employees/${employeeToDelete.id}`);
      fetchFuncionarios();
      setEmployeeToDelete(null);
    } catch(err) {
      console.error("Erro ao deletar funcionário:", err);
      setError("Não foi possível deletar o funcionário.");
      setEmployeeToDelete(null);
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
        <h1>Funcionários</h1>
        <button className={styles.cadastrarBtn} onClick={handleCadastrarClick}>
          Cadastrar Funcionário
        </button>
      </div>
      
      <div className={styles.filterBar}>
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input name="value" type="text" placeholder="Pesquisar..." value={filters.value} onChange={handleFilterChange} className={styles.searchInput}/>
        </div>
        <select name="role" value={filters.role} onChange={handleFilterChange} className={styles.filterSelect}>
          <option value="">Todos os Cargos</option>
          {roleOptions.map(option => <option key={option.id} value={option.id}>{option.name}</option>)}
        </select>
        <select name="status" value={filters.status} onChange={handleFilterChange} className={styles.filterSelect}>
          <option value="">Todos os Status</option>
          {statusOptions.map(option => <option key={option.id} value={option.id}>{option.name}</option>)}
        </select>
      </div>

      <div className={styles.tableContainer}>
        {loading ? ( <p className={styles.message}>Carregando...</p> ) : error ? ( <p className={styles.messageError}>{error}</p> ) : (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Cargo</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {funcionarios.length > 0 ? (
                  funcionarios.map((func) => (
                    <tr key={func.id}>
                      <td className={styles.user}>
                        <img
                          src={func.image ? `data:image/png;base64,${func.image}` : `https://ui-avatars.com/api/?name=${func.name}&background=random`}
                          alt={`Foto de ${func.name}`}
                          className={styles.userAvatar}
                        />
                        {func.name}
                      </td>
                      <td>{func.roleName}</td>
                      <td>{func.statusName}</td>
                      <td className={styles.actionIcons}>
                        <FaEdit title="Editar" onClick={() => handleEditClick(func.id)} />
                        <FaTrash title="Excluir" onClick={() => handleDeleteClick(func)} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className={styles.message}>Nenhum funcionário encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {pagination.totalPages > 1 && (
              <div className={styles.pagination}>
                <button onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={pagination.currentPage === 0}>
                  Anterior
                </button>
                <span>
                  Página {pagination.currentPage + 1} de {pagination.totalPages}
                </span>
                <button onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={pagination.currentPage + 1 >= pagination.totalPages}>
                  Próximo
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Modal isOpen={!!employeeToDelete} onClose={() => setEmployeeToDelete(null)}>
        <div className="logout-modal-content">
          <h3>Confirmar Exclusão</h3>
          <p>Tem certeza que deseja excluir o funcionário <strong>{employeeToDelete?.name}</strong>?</p>
          <p>Esta ação não poderá ser desfeita.</p>
          <div className="logout-modal-buttons">
            <button className="btn-cancel" onClick={() => setEmployeeToDelete(null)}>Cancelar</button>
            <button className="btn-confirm" onClick={handleConfirmDelete}>Sim, Excluir</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Funcionario;
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FuncionarioHorario.module.css';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import api from '../../services/api';
import Modal from '../../components/Modal/Modal';
import { generatePageNumbers } from '../../utils/pagination';

// Hook de Debounce para otimizar a busca por texto
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

function FuncionarioHorario() {
  const navigate = useNavigate();

  // Estados da página
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [horarioToDelete, setHorarioToDelete] = useState(null);

  // Estados para filtros e paginação
  const [filters, setFilters] = useState({ value: '', dayType: '' });
  const [pagination, setPagination] = useState({
    currentPage: 0, pageSize: 10,// paginas por default
     totalPages: 0, hasNextPage: false, hasPreviousPage: false,
  });
  
  // Estados para popular os dropdowns de filtro
  const [dayTypeOptions, setDayTypeOptions] = useState([]);
  const debouncedSearchTerm = useDebounce(filters.value, 500);

  // Efeito para buscar as opções dos filtros (Tipos de Dia)
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await api.get('/employeesWorkdays/daysTypes');
        setDayTypeOptions(response.data.value || []);
      } catch (err) {
        console.error("Erro ao buscar tipos de dia:", err);
      }
    };
    fetchFilterOptions();
  }, []);

  // Função principal para buscar os horários
  const fetchHorarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        CurrentPage: pagination.currentPage + 1,
        PageSize: pagination.pageSize,
        Value: debouncedSearchTerm || null,
        DayType: filters.dayType || null,
      };

      const response = await api.get('/employeesWorkdays', { params });
      
      const { items, totalPages, currentPage, hasNextPage, hasPreviousPage } = response.data.value;
      setHorarios(items);
      setPagination(prev => ({ ...prev, totalPages, currentPage: currentPage - 1, hasNextPage, hasPreviousPage }));

    } catch (err) {
      setError('Não foi possível carregar os horários.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.pageSize, debouncedSearchTerm, filters.dayType]);

  useEffect(() => {
    fetchHorarios();
  }, [fetchHorarios]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, currentPage: 0 }));
  };

   const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setPagination(prev => ({
      ...prev,
      pageSize: newSize,
      currentPage: 0, // Sempre volta para a primeira página ao mudar o tamanho
    }));
  };

  const handleCadastrarClick = () => navigate('/funcionarios-horarios/cadastrar');
  const handleEditClick = (id) => navigate(`/funcionarios-horarios/editar/${id}`);
  const handleDeleteClick = (horario) => setHorarioToDelete(horario);


  const handleConfirmDelete = async () => {
    if (!horarioToDelete) return;
    try {
      // Assumindo endpoint de deleção
      await api.delete(`/employeesWorkdays/${horarioToDelete.id}`);
      fetchHorarios(); // Atualiza a lista
      setHorarioToDelete(null);
    } catch(err) {
      console.error("Erro ao deletar horário:", err);
      setError("Não foi possível deletar o horário.");
      setHorarioToDelete(null);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  // Função para formatar a hora
  const formatTime = (timeString) => {
    if (!timeString) return '--:--';
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('pt-BR', {
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <h1>Horários dos Funcionários</h1>
        <button className={styles.cadastrarBtn} onClick={handleCadastrarClick}>
          Cadastrar Horário
        </button>
      </div>
      
      <div className={styles.filterBar}>
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input name="value" type="text" placeholder="Pesquisar por funcionário..." value={filters.value} onChange={handleFilterChange} className={styles.searchInput}/>
        </div>
        <select name="dayType" value={filters.dayType} onChange={handleFilterChange} className={styles.filterSelect}>
          <option value="">Todos os Dias </option>
          {dayTypeOptions.map(option => <option key={option.value} value={option.value}>{option.name}</option>)}
        </select>
      

        <select
          name="pageSize"
          value={pagination.pageSize}
          onChange={handlePageSizeChange}
          className={styles.filterSelect}
        >
          <option value="2">2 por página</option>
          <option value="5">5 por página</option>
          <option value="10">10 por página</option>
          <option value="15">15 por página</option>
          <option value="20">20 por página</option>
        </select>
      </div>


      <div className={styles.tableContainer}>
        {loading ? ( <p className={styles.message}>Carregando...</p> ) : error ? ( <p className={styles.messageError}>{error}</p> ) : (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Funcionário</th>
                  <th>Dia da Semana</th>
                  <th>Entrada</th>
                  <th>Saída</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {horarios.length > 0 ? (
                  horarios.map((horario) => (
                    <tr key={horario.id}>
                      <td className={styles.user}>
                        <img
                          src={horario.image ? `data:image/png;base64,${horario.image}` : `https://ui-avatars.com/api/?name=${horario.employeeName}&background=random`}
                          alt={`Foto de ${horario.employeeName}`}
                          className={styles.userAvatar}
                        />
                        {horario.employeeName}
                      </td>
                      <td>{horario.dayTypeName}</td>
                      <td>{formatTime(horario.startTime)}</td>
                      <td>{formatTime(horario.endTime)}</td>
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


            
               {/* NOVO: Componente de paginação completo */}
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

      <Modal isOpen={!!horarioToDelete} onClose={() => setHorarioToDelete(null)}>
        <div className="logout-modal-content">
          <h3>Confirmar Exclusão</h3>
          <p>
            Tem certeza que deseja excluir o horário do funcionário 
            <strong> {horarioToDelete?.employeeName}</strong>?
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

export default FuncionarioHorario;
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Funcionario.module.css';
import { FaEdit, FaTrash, FaSearch, FaFilePdf } from 'react-icons/fa';
import api from '../../services/api';
import Modal from '../../components/Modal/Modal';
import { generatePageNumbers } from '../../utils/pagination';
import jsPDF from 'jspdf';
import 'jspdf-autotable';



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

  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [filters, setFilters] = useState({ value: '', status: '', role: '' });
  const [pagination, setPagination] = useState({
    currentPage: 0, pageSize: 10, totalPages: 0, hasNextPage: false, hasPreviousPage: false,
  });
  const [feedback, setFeedback] = useState({ isOpen: false, message: '', isError: false });
  const [sortConfig, setSortConfig] = useState({ field: 'id', order: 'Desc' });
  const [statusOptions, setStatusOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const debouncedSearchTerm = useDebounce(filters.value, 500);

//novo estado para controlar o modl de pdf
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfOptions, setPdfOptions] = useState({
    status: '',
    limit: '', // Quantidade de resultados
    sortAlphabetical: false // Ordem alfabética
  });
  const [pdfLoading, setPdfLoading] = useState(false); // Loading específico para o PDF

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
        OrderField: sortConfig.field,
        OrderType: sortConfig.order,
      };

      const response = await api.get('/employees', { params });

      // Extrai TODAS as informações, incluindo totalItems
      const { items, totalPages, currentPage, hasNextPage, hasPreviousPage, totalItems } = response.data.value;

      setFuncionarios(items);

      // Salva TODAS as informações no estado de paginação
      setPagination(prev => ({
        ...prev,
        totalPages,
        currentPage: currentPage - 1, // Converte para 0-based
        hasNextPage,
        hasPreviousPage,
        totalItems // Salva o total de itens aqui
      }));

    } catch (err) {
      setError('Não foi possível carregar os funcionários.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.pageSize, debouncedSearchTerm, filters.status, filters.role, sortConfig]);
  // 2. O useEffect agora "assiste" à função 'fetchFuncionarios'
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


  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setPagination(prev => ({
      ...prev,
      pageSize: newSize,
      currentPage: 0, // Sempre volta para a primeira página ao mudar o tamanho
    }));
  };
//const handlePageSizeChange = (e) => {
  //const newSize = parseInt(e.target.value, 10);
 // setPagination({
  //  ...pagination,
  //  pageSize: newSize,
//currentPage: 0, // Sempre volta para a primeira página ao mudar o tamanho
  //});
//};

const handlePdfOptionsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPdfOptions(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGeneratePdf = async () => {
    setPdfLoading(true);
    setError(null); // Limpa erros anteriores
    try {
      // Prepara os parâmetros para a API com base nas opções do modal
      const params = {
        CurrentPage: 1, // Sempre começa da primeira página para o PDF
        // Usa o limite do modal, ou busca todos se o limite for vazio (ou um número alto)
        PageSize: pdfOptions.limit || pagination.totalItems || 1000, 
        Status: pdfOptions.status || null,
        // Aplica ordenação alfabética se selecionado
        OrderField: pdfOptions.sortAlphabetical ? 'name' : 'id',
        OrderType: pdfOptions.sortAlphabetical ? 'Asc' : 'Desc',
      };

      // Busca os dados especificamente para o PDF
      const response = await api.get('/employees', { params });
      const pdfData = response.data.value.items || [];

      if (pdfData.length === 0) {
        setFeedback({ isOpen: true, message: 'Nenhum funcionário encontrado com os filtros selecionados para gerar o PDF.', isError: true });
        setIsPdfModalOpen(false);
        setPdfLoading(false);
        return;
      }

      // Gera o PDF
      const doc = new jsPDF();
      doc.text("Relatório de Funcionários", 14, 15);
      doc.setFontSize(10);
      doc.text(`Filtros: Status=${pdfOptions.status || 'Todos'}, Limite=${pdfOptions.limit || 'Todos'}, Ordem=${pdfOptions.sortAlphabetical ? 'Alfabética' : 'Padrão'}`, 14, 22);

      const head = [['Nome', 'Cargo', 'Status']];
      const body = pdfData.map(func => [
        func.name,
        func.roleName,
        func.statusName
      ]);

      doc.autoTable({
        startY: 28,
        head: head,
        body: body,
      });

      doc.save('relatorio_funcionarios.pdf');
      setIsPdfModalOpen(false); // Fecha o modal após gerar

    } catch (err) {
      setError('Erro ao gerar o PDF. Tente novamente.');
      console.error("Erro ao buscar dados para PDF:", err);
    } finally {
      setPdfLoading(false);
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

    
  {/* CORRIGIDO: Usando opt.value para a key e para o value */}
  {roleOptions.map(option => <option key={option.value} value={option.value}>{option.name}</option>)}
</select>
        <select name="status" value={filters.status} onChange={handleFilterChange} className={styles.filterSelect}>
         
          <option value="">Todos os Status</option> {/* CORRIGIDO: Usando opt.value para a key e para o value */}
  {statusOptions.map(option => <option key={option.value} value={option.value}>{option.name}</option>)}
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


  <button className={styles.pdfButton} onClick={() => setIsPdfModalOpen(true)}>
          <FaFilePdf /> Gerar PDF
        </button>
      
      </div>


  {/* ... searchContainer e os outros selects ... */}




      <div className={styles.tableContainer}>
        {loading ? ( <p className={styles.message}>Carregando...</p> ) : error ? ( <p className={styles.messageError}>{error}</p> ) : (
          <>
          <div className={styles.tableContainer}>
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
            </div>
          
            
          </>
        )}
      </div>


 {/* PAGINAÇÃO MOVIDA PARA FORA E PARA BAIXO DO tableContainer */}

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
        
       
     

      <Modal isOpen={!!employeeToDelete} onClose={() => setEmployeeToDelete(null)}>
        <div className="logout-modal-content">
          <h3>Confirmação de Exclusão</h3>
          <p>Tem certeza que deseja excluir o funcionário <strong>{employeeToDelete?.name}</strong>?</p>
          <p>Esta ação não poderá ser desfeita.</p>
          <div className="logout-modal-buttons">
            <button className="btn-cancel" onClick={() => setEmployeeToDelete(null)}>Cancelar</button>
            <button className="btn-confirm" onClick={handleConfirmDelete}>Sim, Excluir</button>
          </div>
        </div>
      </Modal>



<Modal isOpen={isPdfModalOpen} onClose={() => setIsPdfModalOpen(false)}>
        <div className="feedback-modal-content"> {/* Reutilizando estilo */}
          <h3>Configurar Relatório PDF</h3>
          
          <div className={styles.pdfForm}>
            <div className={styles.pdfInputGroup}>
              <label htmlFor="pdfStatus">Filtrar por Status:</label>
              <select 
                id="pdfStatus" 
                name="status" 
                value={pdfOptions.status} 
                onChange={handlePdfOptionsChange} 
                className={styles.pdfSelect}
              >
                <option value="">Todos os Status</option>
                {statusOptions.map(option => <option key={option.value} value={option.value}>{option.name}</option>)}
              </select>
            </div>

            <div className={styles.pdfInputGroup}>
              <label htmlFor="pdfLimit">Número máximo de resultados:</label>
              <input 
                id="pdfLimit" 
                name="limit" 
                type="number" 
                min="1" 
                placeholder="Todos" 
                value={pdfOptions.limit} 
                onChange={handlePdfOptionsChange}
                className={styles.pdfInput}
              />
            </div>

            <div className={styles.pdfCheckboxGroup}>
              <input 
                id="pdfSort" 
                name="sortAlphabetical" 
                type="checkbox" 
                checked={pdfOptions.sortAlphabetical} 
                onChange={handlePdfOptionsChange} 
              />
              <label htmlFor="pdfSort">Ordenar por nome (A-Z)</label>
            </div>
          </div>

          {/* Exibe mensagem de erro dentro do modal, se houver */}
          {error && <p className={styles.pdfError}>{error}</p>} 

          <div className="logout-modal-buttons">
            <button className="btn-cancel" onClick={() => setIsPdfModalOpen(false)} disabled={pdfLoading}>
              Cancelar
            </button>
            <button className="btn-primary" onClick={handleGeneratePdf} disabled={pdfLoading}>
              {pdfLoading ? 'Gerando...' : 'Gerar PDF'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de feedback genérico (caso o handleGeneratePdf falhe e precise mostrar msg) */}
      <Modal isOpen={feedback.isOpen && !isPdfModalOpen} onClose={() => setFeedback({ isOpen: false, message: '', isError: false })}>
         <div className="feedback-modal-content">
             {/* ... */}
         </div>
      </Modal>
    </div>
  );
}

export default Funcionario;
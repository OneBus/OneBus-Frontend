import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Veiculo.module.css';
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

function Veiculo() {
  const navigate = useNavigate();

  // Estados da página
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  // Estados para filtros e paginação
  const [filters, setFilters] = useState({
    value: '',
    status: '',
    brand: '', // Corresponde à Marca da Carroceria
    chassisBrand: '',
    serviceType: '',
    busHasLeftDoors: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 0, pageSize: 10, totalPages: 0, hasNextPage: false, hasPreviousPage: false,
  });
  
  // Estados para popular os dropdowns de filtro
  const [statusOptions, setStatusOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [chassisBrandOptions, setChassisBrandOptions] = useState([]);
  const [serviceTypeOptions, setServiceTypeOptions] = useState([]);

  const debouncedSearchTerm = useDebounce(filters.value, 500);

  // Efeito para buscar as opções dos filtros
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [statusRes, brandsRes, chassisBrandsRes, servicesRes] = await Promise.all([
          api.get('/vehicles/status'),
          api.get('/vehicles/brands'),
          api.get('/vehicles/chassisBrands'),
          api.get('/vehicles/serviceTypes'),
        ]);
        
        setStatusOptions(statusRes.data.value || []);
        setBrandOptions(brandsRes.data.value || []);
        setChassisBrandOptions(chassisBrandsRes.data.value || []);
        setServiceTypeOptions(servicesRes.data.value || []);
      } catch (err) {
        console.error("Erro ao buscar opções de filtro:", err);
      }
    };
    fetchFilterOptions();
  }, []);

  // Função principal para buscar os veículos
  const fetchVeiculos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        CurrentPage: pagination.currentPage + 1,
        PageSize: pagination.pageSize,
        Value: debouncedSearchTerm || null,
        Status: filters.status || null,
        Brand: filters.brand || null,
        BusChassisBrand: filters.busChassisBrand || null,
        ServiceType: filters.ServiceType || null,
        BusHasLeftDoors: filters.busHasLeftDoors !== '' ? filters.busHasLeftDoors : null,
      };

      const response = await api.get('/vehicles', { params });
      
      const { items, totalPages, currentPage, hasNextPage, hasPreviousPage } = response.data.value;
      setVeiculos(items);
      setPagination(prev => ({ ...prev, totalPages, currentPage: currentPage - 1, hasNextPage, hasPreviousPage }));

    } catch (err) {
      setError('Não foi possível carregar os veículos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.pageSize, debouncedSearchTerm, filters]);

  useEffect(() => {
    fetchVeiculos();
  }, [fetchVeiculos]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, currentPage: 0 }));
  };

  const handlePageSizeChange = (e) => {
    setPagination(prev => ({ ...prev, pageSize: parseInt(e.target.value, 10), currentPage: 0 }));
  };
  
  const handleCadastrarClick = () => navigate('/veiculo/cadastrar');
  const handleEditClick = (id) => navigate(`/veiculo/editar/${id}`);
  const handleDeleteClick = (vehicle) => setVehicleToDelete(vehicle);

  const handleConfirmDelete = async () => {
    if (!vehicleToDelete) return;
    try {
      await api.delete(`/vehicles/${vehicleToDelete.id}`);
      fetchVeiculos();
      setVehicleToDelete(null);
    } catch(err) {
      setError("Não foi possível deletar o veículo.");
      setVehicleToDelete(null);
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
        <h1>Veículos</h1>
        <button className={styles.cadastrarBtn} onClick={handleCadastrarClick}>
          Cadastrar Veículo
        </button>
      </div>
      
      <div className={styles.filterBar}>
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input name="value" type="text" placeholder="Pesquisar..." value={filters.value} onChange={handleFilterChange} className={styles.searchInput}/>
        </div>
        <select name="status" value={filters.status} onChange={handleFilterChange} className={styles.filterSelect}>
          <option value="">Todos os Status</option>
          {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
        </select>
        <select name="brand" value={filters.brand} onChange={handleFilterChange} className={styles.filterSelect}>
          <option value="">Todas as Marcas</option>
          {brandOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
        </select>
        <select name="busChassisBrand" value={filters.busChassisBrand} onChange={handleFilterChange} className={styles.filterSelect}>
          <option value="">Todas as Marcas de Chassi</option>
          {chassisBrandOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
        </select>
        <select name="busServiceType" value={filters.busServiceType} onChange={handleFilterChange} className={styles.filterSelect}>
          <option value="">Todos os Serviços</option>
          {serviceTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
        </select>
        <select name="busHasLeftDoors" value={filters.busHasLeftDoors} onChange={handleFilterChange} className={styles.filterSelect}>
          <option value="">Portas à Esquerda (Todos)</option>
          <option value="true">Sim</option>
          <option value="false">Não</option>
        </select>
        <select name="pageSize" value={pagination.pageSize} onChange={handlePageSizeChange} className={styles.filterSelect}>
          <option value="2">2 por página</option>
          <option value="5">5 por página</option>
          <option value="10">10 por página</option>
          <option value="20">20 por página</option>
          <option value="50">50 por página</option>
        </select>
      </div>

      {loading ? ( 
        <p className={styles.message}>Carregando...</p> 
      ) : error ? ( 
        <p className={styles.messageError}>{error}</p> 
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Prefixo</th>
                  <th>Modelo</th>
                  <th>Modelo do Chassi</th>
                  <th>Placa</th>
                  <th>Portas à Esquerda</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {veiculos.length > 0 ? (
                  veiculos.map((veiculo) => (
                    <tr key={veiculo.id}>
                      <td className={styles.user}>
                        <img src={veiculo.image ? `data:image/png;base64,${veiculo.image}` : `https://ui-avatars.com/api/?name=${veiculo.prefixo || 'V'}&background=random`} alt={`Foto do veículo ${veiculo.prefixo}`} className={styles.userAvatar} />
                        {veiculo.prefix}
                      </td>
                      <td>{veiculo.model}</td>
                      <td>{veiculo.busChassisModel}</td>
                      <td>{veiculo.plate}</td>
                      <td>{veiculo.busHasLeftDoors ? 'Sim' : 'Não'}</td>
                      <td>{veiculo.statusName}</td>
                      <td className={styles.actionIcons}>
                        <FaEdit title="Editar" onClick={() => handleEditClick(veiculo.id)} />
                        <FaTrash title="Excluir" onClick={() => handleDeleteClick(veiculo)} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className={styles.message}>Nenhum veículo encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

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

      <Modal isOpen={!!vehicleToDelete} onClose={() => setVehicleToDelete(null)}>
        <div className="logout-modal-content">
          <h3>Confirmar Exclusão</h3>
          <p>
            Tem certeza que deseja excluir o veículo de prefixo
            <strong> {vehicleToDelete?.prefix}</strong>?
          </p>
          <div className="logout-modal-buttons">
            <button className="btn-cancel" onClick={() => setVehicleToDelete(null)}>Cancelar</button>
            <button className="btn-confirm" onClick={handleConfirmDelete}>Sim, Excluir</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Veiculo;
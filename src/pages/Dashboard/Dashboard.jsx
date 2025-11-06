import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

// Cores que combinam com o design do OneBus
const COLORS_VEHICLES = ['#00A0DC', '#28a745', '#ffc107', '#6c757d', '#9556d7'];
const COLORS_EMPLOYEES = ['#28a745', '#00A0DC', '#9556d7', '#ffc107', '#dc3545', '#6c757d', '#17a2b8'];

// Componente para o rótulo central (Total)
const CustomCenterLabel = ({ total, title }) => (
  <>
    <text x="50%" y="45%" textAnchor="middle" dominantBaseline="central" fontSize="1.5rem" fontWeight="bold" fill="#333">
      {total}
    </text>
    <text x="50%" y="58%" textAnchor="middle" dominantBaseline="central" fontSize="0.9rem" fill="#666">
      {title}
    </text>
  </>
);

// NOVO: Componente para a Janela Flutuante de Detalhes
const DashboardTooltip = ({ activeData, type }) => {
  if (!activeData || !activeData.items) {
    return <div className={styles.tooltipWrapper} style={{ opacity: 0 }} />;
  }

  const title = activeData.name;
  const items = activeData.items;

  return (
    <div className={styles.tooltipWrapper}>
      <h4 className={styles.tooltipTitle}>{title} ({items.length})</h4>
      <div className={styles.tooltipList}>
        {type === 'vehicle' ? (
          // Lista de Veículos
          items.map(item => (
            <div key={item.id} className={styles.tooltipItem}>
              <img
                src={item.image ? `data:image/png;base66,${item.image}` : `https://ui-avatars.com/api/?name=${item.prefix}&background=random`}
                alt={item.prefix}
                className={styles.tooltipAvatar}
              />
              <div className={styles.tooltipInfo}>
                <span className={styles.tooltipPrimary}>{item.prefix} - {item.model}</span>
                <span className={styles.tooltipSecondary}>{item.plate} | Chassi: {item.busChassisModel || 'N/A'}</span>
              </div>
            </div>
          ))
        ) : (
          // Lista de Funcionários
          items.map(item => (
            <div key={item.id} className={styles.tooltipItem}>
              <img
                src={item.image ? `data:image/png;base66,${item.image}` : `https://ui-avatars.com/api/?name=${item.name}&background=random`}
                alt={item.name}
                className={styles.tooltipAvatar}
              />
              <div className={styles.tooltipInfo}>
                <span className={styles.tooltipPrimary}>{item.name}</span>
                <span className={styles.tooltipSecondary}>{item.roleName} | Código: {item.code}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

function Dashboard() {
  const [vehicleData, setVehicleData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [totalVeiculos, setTotalVeiculos] = useState(0);
  const [totalFuncionarios, setTotalFuncionarios] = useState(0);
  
  // Estados para a tooltip interativa
  const [hoveredVehicleData, setHoveredVehicleData] = useState(null);
  const [hoveredEmployeeData, setHoveredEmployeeData] = useState(null);

  useEffect(() => {
    // Busca e transforma os dados dos Veículos
    const fetchVehicles = async () => {
      try {
        const response = await api.get('/dashboards/vehicles');
        const data = response.data.value;
        setTotalVeiculos(data.totalCount);
        // Mapeia os dados da API para o formato do gráfico
        const formattedData = data.vehicleCounts.map(item => ({
          name: item.statusName,
          value: item.count,
          items: item.vehicles, // Guarda a lista de veículos para a tooltip
        }));
        setVehicleData(formattedData);
      } catch (err) {
        console.error("Erro ao buscar dados de veículos:", err);
      }
    };

    // Busca e transforma os dados dos Funcionários
    const fetchEmployees = async () => {
      try {
        const response = await api.get('/dashboards/employees');
        const data = response.data.value;
        setTotalFuncionarios(data.totalCount);
        // Mapeia os dados da API para o formato do gráfico
        const formattedData = data.employeeCounts.map(item => ({
          name: item.statusName,
          value: item.count,
          items: item.employees, // Guarda a lista de funcionários para a tooltip
        }));
        setEmployeeData(formattedData);
      } catch (err) {
        console.error("Erro ao buscar dados de funcionários:", err);
      }
    };

    fetchVehicles();
    fetchEmployees();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <h1>Dashboard</h1>
      </div>

      <div className={styles.chartsGrid}>
        {/* --- Gráfico de Veículos --- */}
        <div className={styles.chartContainer}>
          <h3 className={styles.chartTitle}>Resumo de Veículos</h3>
          <div className={styles.chartWithTooltip}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vehicleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  onMouseEnter={(data) => setHoveredVehicleData(data.payload)}
                  onMouseLeave={() => setHoveredVehicleData(null)}
                >
                  {vehicleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_VEHICLES[index % COLORS_VEHICLES.length]} />
                  ))}
                </Pie>
                <CustomCenterLabel total={totalVeiculos} title="Veículos Totais" />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <DashboardTooltip activeData={hoveredVehicleData} type="vehicle" />
          </div>
        </div>

        {/* --- Gráfico de Funcionários --- */}
        <div className={styles.chartContainer}>
          <h3 className={styles.chartTitle}>Resumo de Funcionários</h3>
          <div className={styles.chartWithTooltip}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={employeeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  onMouseEnter={(data) => setHoveredEmployeeData(data.payload)}
                  onMouseLeave={() => setHoveredEmployeeData(null)}
                >
                  {employeeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_EMPLOYEES[index % COLORS_EMPLOYEES.length]} />
                  ))}
                </Pie>
                <CustomCenterLabel total={totalFuncionarios} title="Funcionários" />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <DashboardTooltip activeData={hoveredEmployeeData} type="employee" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
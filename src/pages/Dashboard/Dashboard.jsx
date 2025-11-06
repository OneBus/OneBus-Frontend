import React from 'react';
import styles from './Dashboard.module.css';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- DADOS ESTÁTICOS (MOCK) ---
// Substitua por chamadas de API quando os endpoints de estatísticas existirem

// Mock para o gráfico de Veículos
const vehicleData = [
  { name: 'Disponível', value: 3 },
  { name: 'Em Operação', value: 18 },
  { name: 'Em Manutenção', value: 3 },
  { name: 'Desativado', value: 0 },
  { name: 'Reservado', value: 4 },
];
const totalVeiculos = vehicleData.reduce((sum, entry) => sum + entry.value, 0);

// Mock para o gráfico de Funcionários
const employeeData = [
  { name: 'Ativo', value: 30 },
  { name: 'Férias', value: 4 },
  { name: 'Licença', value: 1 },
  { name: 'Folga', value: 5 },
  { name: 'Ausente', value: 1 },
  { name: 'Desligado', value: 0 },
  { name: 'Em Contratação', value: 2 },
];
const totalFuncionarios = employeeData.reduce((sum, entry) => sum + entry.value, 0);

// Cores que combinam com o design do OneBus (azul, roxo, cinzas)
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

function Dashboard() {
  // Aqui você buscaria os dados da API com useEffect, ex:
  // useEffect(() => {
  //   api.get('/dashboard/vehicle-summary').then(res => setVehicleData(res.data.value));
  //   api.get('/dashboard/employee-summary').then(res => setEmployeeData(res.data.value));
  // }, []);

  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <h1>Dashboard</h1>
      </div>

      <div className={styles.chartsGrid}>
        {/* Gráfico de Veículos */}
        <div className={styles.chartContainer}>
          <h3 className={styles.chartTitle}>Resumo de Veículos</h3>
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
              >
                {vehicleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS_VEHICLES[index % COLORS_VEHICLES.length]} />
                ))}
              </Pie>
              <CustomCenterLabel total={totalVeiculos} title="Veículos Totais" />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Funcionários */}
        <div className={styles.chartContainer}>
          <h3 className={styles.chartTitle}>Resumo de Funcionários</h3>
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
              >
                {employeeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS_EMPLOYEES[index % COLORS_EMPLOYEES.length]} />
                ))}
              </Pie>
              <CustomCenterLabel total={totalFuncionarios} title="Funcionários" />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
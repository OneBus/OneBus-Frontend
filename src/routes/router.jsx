import React from 'react';
import { Routes, Route } from "react-router-dom";
import Funcionario from "../pages/Funcionario/Funcionario";
import FuncionarioCadastro from '../pages/FuncionarioCadastro/FuncionarioCadastro';
const Placeholder = ({ title }) => (
    <div style={{ padding: '10rem' }}>
      <h1>{title}</h1>
    </div>
  );

const AppRoutes = () => {
  return (
    
     <Routes>
            
            <Route path="/funcionario" element={<Funcionario />} />
            <Route path="/funcionarios/cadastrar" element={<FuncionarioCadastro />} />
            <Route path="/funcionario-horario" element={<Placeholder title="Tela de Funcionário Horário" />} />
            <Route path="/veiculo" element={<Placeholder title="Tela de Veículo" />} />
            <Route path="/veiculo-operacao" element={<Placeholder title="Tela de Veículo Operação" />} />
            <Route path="/linha" element={<Placeholder title="Tela de Linha" />} />
            <Route path="/linha-horario" element={<Placeholder title="Tela de Linha Horário" />} />
            <Route path="/manutencao" element={<Placeholder title="Tela de Manutenção" />} />
           
            <Route path="/usuarios" element={<Placeholder title="Tela de Usuários" />} />
          </Routes>
    
  );
};

export default AppRoutes;
import React from 'react';
import { Routes, Route } from "react-router-dom";
import Funcionario from "../pages/Funcionario/Funcionario";
import FuncionarioCadastro from '../pages/FuncionarioCadastro/FuncionarioCadastro';
import FuncionarioEdicao from '../pages/FuncionarioEdicao/FuncionarioEdicao';


import FuncionarioHorario from '../pages/FuncionarioHorario/FuncionarioHorario';
import FuncionarioHorarioCadastro from '../pages/FuncionarioHorarioCadastro/FuncionarioHorarioCadastro';
import FuncionarioHorarioEdicao from '../pages/FuncionarioHorarioEdicao/FuncionarioHorarioEdicao'; // 1. Importe o novo componente

import Veiculo from '../pages/Veiculo/Veiculo';

import Linha from '../pages/Linha/Linha';

const Placeholder = ({ title }) => (
    <div style={{ padding: '10rem' }}>
      <h1>{title}</h1>
    </div>
  );

const AppRoutes = () => {
  return (
    
     <Routes>
             {/*<Route path="/" element={<VeiculoOperacao />} />*/}
            <Route path="/funcionario" element={<Funcionario />} />
            <Route path="/funcionarios/cadastrar" element={<FuncionarioCadastro />} />
             <Route path="/funcionarios/editar/:id" element={<FuncionarioEdicao />} />
            <Route path="/funcionario-horario" element={<FuncionarioHorario />} />
           

             <Route path="/funcionario-horario" element={<FuncionarioHorario />} />
            <Route path="/funcionarios-horarios/cadastrar" element={<FuncionarioHorarioCadastro />} />
            <Route path="/funcionarios-horarios/editar/:id" element={<FuncionarioHorarioEdicao />} />
      
            
            <Route path="/veiculo" element={<Veiculo/>} />
            <Route path="/veiculo-operacao" element={<Placeholder title="Tela de Veículo Operação" />} />
            <Route path="/linha" element={<Linha/>} />
            <Route path="/linha-horario" element={<Placeholder title="Tela de Linha Horário" />} />
            <Route path="/manutencao" element={<Placeholder title="Tela de Manutenção" />} />
           
            <Route path="/usuarios" element={<Placeholder title="Tela de Usuários" />} />
          </Routes>
    
  );
};

export default AppRoutes;
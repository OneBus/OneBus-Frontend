import React from 'react';
import { Routes, Route, Router } from "react-router-dom";


import Funcionario from "../pages/Funcionario/Funcionario";
import FuncionarioCadastro from '../pages/FuncionarioCadastro/FuncionarioCadastro';
import FuncionarioEdicao from '../pages/FuncionarioEdicao/FuncionarioEdicao';


import FuncionarioHorario from '../pages/FuncionarioHorario/FuncionarioHorario';
import FuncionarioHorarioCadastro from '../pages/FuncionarioHorarioCadastro/FuncionarioHorarioCadastro';
import FuncionarioHorarioEdicao from '../pages/FuncionarioHorarioEdicao/FuncionarioHorarioEdicao'; // 1. Importe o novo componente

import Veiculo from '../pages/Veiculo/Veiculo';
import VeiculoCadastro from '../pages/VeiculoCadastro/VeiculoCadastro';
import VeiculoEdicao from '../pages/VeiculoEdicao/VeiculoEdicao';
 
import Linha from '../pages/Linha/Linha';
import LinhaCadastro from '../pages/LinhaCadastro/LinhaCadastro';
import LinhaEdicao from '../pages/LinhaEdicao/LinhaEdicao';
// 1. Importe o novo componente

import LinhaHorario from '../pages/LinhaHorario/LinhaHorario.jsx';
import LinhaHorarioCadastro from '../pages/LinhaHorarioCadastro/LinhaHorarioCadastro.jsx';
import LinhaHorarioEdicao from '../pages/LinhaHorarioEdicao/LinhaHorarioEdicao.jsx';

import Manutencao from '../pages/Manutencao/Manutencao.jsx';
import ManutencaoCadastro from '../pages/ManutencaoCadastro/ManutencaoCadastro.jsx';
import ManutencaoEdicao from '../pages/ManutencaoEdicao/ManutencaoEdicao.jsx';


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
            <Route path="/funcionarios-horarios/cadastrar" element={<FuncionarioHorarioCadastro />} />
            <Route path="/funcionarios-horarios/editar/:id" element={<FuncionarioHorarioEdicao />} />
      
            
            <Route path="/veiculo" element={<Veiculo/>} />
            <Route path="/veiculo/cadastrar" element={<VeiculoCadastro />} />
            <Route path="/veiculo/editar/:id" element={<VeiculoEdicao/>} />


            <Route path="/veiculo-operacao" element={<Placeholder title="Tela de Veículo Operação" />} />


            <Route path="/linha" element={<Linha/>} />
            <Route path="/linha/cadastrar" element={<LinhaCadastro />} />
            <Route path="/linha/editar/:id" element={<LinhaEdicao />} />
       


            <Route path="/linha-horario" element={<LinhaHorario />} />
            <Route path="/linha-horario/cadastrar" element={<LinhaHorarioCadastro/>} />
            <Route path="/linha-horario/editar/:id" element={<LinhaHorarioEdicao/>} />


            <Route path="/manutencao" element={<Manutencao/>} />
            <Route path="/manutencao/cadastrar" element={<ManutencaoCadastro/>} />
            <Route path="/manutencao/editar/:id" element={<ManutencaoEdicao />} />

           
            <Route path="/usuarios" element={<Placeholder title="Tela de Usuários" />} />
          </Routes>
    
  );
};

export default AppRoutes;
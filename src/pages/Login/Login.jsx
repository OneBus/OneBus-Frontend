import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

// CAMINHOS CORRIGIDOS AQUI
import Modal from '../../components/Modal/Modal'; 
import onebusLogo from '../../assets/onebus-logo.png';
import api from '../../services/api'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/users/logins', {
        email,
        password
      });

      const { token } = response.data;
      localStorage.setItem('authToken', token);
      navigate('/'); 

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.logoPanel}>
        <div className={styles.logoWrapper}>
            <img src={onebusLogo} alt="Logo OneBus" className={styles.logoImage} />
        </div>
      </div>
     
      <div className={styles.formPanel}>
        <div className={styles.formWrapper}>
          <p className={styles.welcomeText}>Bem vindo ao <span className={styles.appName}>ONEBUS</span></p>
          <h2 className={styles.title}>Login</h2>
          <form className={styles.form} onSubmit={handleLogin}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Seu Email</label>
              <input 
                type="email" 
                id="email" 
                placeholder="Insira seu Email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="password">Sua Senha</label>
              <input 
                type="password" 
                id="password" 
                placeholder="Insira sua Senha" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <a href="#" className={styles.forgotPassword} onClick={(e) => { e.preventDefault(); setError("Para redefinir a senha, converse com seus superiores.")}}>
              Esqueceu a senha?
            </a>
            <button type="submit" className={styles.loginButton} disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>

      <Modal isOpen={!!error} onClose={() => setError(null)}>
        <div className={styles.modalContent}>
          <h3>Atenção</h3>
          <p>{error}</p>
          <button onClick={() => setError(null)} className={styles.modalButton}>
            Fechar
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Login;

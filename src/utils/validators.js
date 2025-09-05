// /src/utils/validators.js

/**
 * Valida um CPF brasileiro.
 * @param {string} cpf - O CPF a ser validado (pode conter máscara).
 * @returns {boolean} - True se o CPF for válido, false caso contrário.
 */
export const validateCPF = (cpf) => {
  const cpfClean = cpf.replace(/[^\d]/g, ''); // Remove caracteres não numéricos

  if (cpfClean.length !== 11 || /^(\d)\1{10}$/.test(cpfClean)) {
    return false;
  }

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpfClean.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cpfClean.substring(9, 10))) {
    return false;
  }

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpfClean.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cpfClean.substring(10, 11))) {
    return false;
  }

  return true;
};

/**
 * Aplica máscara de CPF (XXX.XXX.XXX-XX) a uma string.
 * @param {string} value - O valor do CPF.
 * @returns {string} - O CPF com máscara.
 */
export const maskCPF = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .substring(0, 14);
};

/**
 * Aplica máscara de telefone ((XX) XXXXX-XXXX) a uma string.
 * @param {string} value - O valor do telefone.
 * @returns {string} - O telefone com máscara.
 */
export const maskPhone = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
};

/**
 * Retorna a data de hoje no formato AAAA-MM-DD.
 * @returns {string} - A data de hoje.
 */
export const getTodayDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
}
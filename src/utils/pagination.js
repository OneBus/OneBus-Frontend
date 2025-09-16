export const generatePageNumbers = (currentPage, totalPages) => {
  // currentPage é 0-based (começa em 0)
  const pages = [];

  // Lógica para mostrar até 5 números de página de forma inteligente
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage < 3) {
      pages.push(1, 2, 3, 4, 5);
    } else if (currentPage > totalPages - 4) {
      pages.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(currentPage, currentPage + 1, currentPage + 2, currentPage + 3, currentPage + 4);
    }
  }

  // Converte de volta para 0-based para comparação no JSX
  return pages.map(p => p - 1);
};
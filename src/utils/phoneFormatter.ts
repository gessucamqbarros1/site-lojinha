
export const formatPhoneNumber = (value: string): string => {
  // Remove todos os caracteres não numéricos
  const numbers = value.replace(/\D/g, '');
  
  // Aplica formatação brasileira com código do país
  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 4) {
    return `+${numbers.slice(0, 2)} (${numbers.slice(2)}`;
  } else if (numbers.length <= 6) {
    return `+${numbers.slice(0, 2)} (${numbers.slice(2, 4)}) ${numbers.slice(4)}`;
  } else if (numbers.length <= 10) {
    return `+${numbers.slice(0, 2)} (${numbers.slice(2, 4)}) ${numbers.slice(4, 8)}-${numbers.slice(8)}`;
  } else {
    return `+${numbers.slice(0, 2)} (${numbers.slice(2, 4)}) ${numbers.slice(4, 9)}-${numbers.slice(9, 13)}`;
  }
};

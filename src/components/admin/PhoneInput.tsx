
import React from 'react';
import { formatPhoneNumber } from '@/utils/phoneFormatter';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange }) => {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numbersOnly = e.target.value.replace(/\D/g, '');
    onChange(numbersOnly);
  };

  const getDisplayPhoneNumber = (): string => {
    if (!value) return '';
    return formatPhoneNumber(value);
  };

  return (
    <div>
      <label htmlFor="whatsappNumber" className="block text-sm font-medium text-vintage-dark mb-1">
        Número do WhatsApp
      </label>
      <input
        id="whatsappNumber"
        type="text"
        value={getDisplayPhoneNumber()}
        onChange={handlePhoneChange}
        className="vintage-input w-full"
        placeholder="+55 (11) 99999-9999"
        maxLength={19}
      />
      <p className="text-xs text-vintage-dark/60 mt-1">
        Digite apenas números. Exemplo: 5511999999999 será formatado automaticamente
      </p>
      {value && value.length >= 13 && (
        <p className="text-xs text-green-600 mt-1">
          ✓ Número válido: {getDisplayPhoneNumber()}
        </p>
      )}
    </div>
  );
};

export default PhoneInput;

// src/components/ui/PhoneInput/PhoneInput.jsx
import { Input } from 'antd';
import { getRawPhoneDigits, formatPhoneDisplay } from '../../../utils/phoneFormatter';

const PhoneInput = ({ value = '', onChange, placeholder, ...props }) => {
  const displayValue = formatPhoneDisplay(value || '');

  const handleChange = (e) => {
    const raw = getRawPhoneDigits(e.target.value).slice(0, 11);
    onChange(raw);
  };

  return (
    <Input
      {...props}
      placeholder={placeholder || '0912 345 6789'}
      value={displayValue}
      onChange={handleChange}
    />
  );
};

export default PhoneInput;
import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

const Input = ({ value, onChange, label, placeholder, type }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <label className='text-sm text-black'>{label}</label>
      <div className='input-box'>
        <input
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          className='w-full bg-transparent outline-none'
          value={value}
          onChange={onChange}
        />
        {type === 'password' && (
          showPassword ? (
            <FaRegEye size={20} className='text-red-700 cursor-pointer' onClick={toggleShowPassword} />
          ) : (
            <FaRegEyeSlash size={20} className='text-black cursor-pointer' onClick={toggleShowPassword} />
          )
        )}
      </div>
    </div>
  );
};

export default Input;

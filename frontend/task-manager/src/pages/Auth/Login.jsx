import { useState } from 'react'; 
import AuthLayout from '../../components/layouts/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/inputs/Input';
import { validateEmail } from '../../utils/helper';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if(!validateEmail(email)){
      setError("Coloque um e-mail válido");
      return;
    }

    if(!password){
      setError("Insira a senha");
      return;
    }

    // lógica de envio para o backend
    setError("");
  };

  return (
    <AuthLayout>
      <h3 className='text-3xl font-bold text-red-700 mb-1'>Bem Vindo</h3>
      <p className='text-sm text-black mb-6'>Entre para continuar</p>
      <form onSubmit={handleLogin} className='w-full'>
        <Input 
          value={email}
          onChange={({target}) => setEmail(target.value)}
          label="Email"
          placeholder='exemplo@email.com'
          type='text'
        />
        <Input 
          value={password}
          onChange={({target}) => setPassword(target.value)}
          label="Senha"
          placeholder='Digite a senha'
          type='password'
        />

        {error && <p className='text-red-500 text-xs pb-2.5'> {error} </p>}

        <button 
          type='submit' 
          className='btn-primary'
        >
          ENTRAR
        </button>

        <p className='text-[13px] text-slate-800 mt-3'> 
          Não tem uma conta?{" "} <Link className='font-medium text-primary underline' to="/signup">Cadastre-se</Link> 
        </p>
      </form>
    </AuthLayout>
  );
}

export default Login;

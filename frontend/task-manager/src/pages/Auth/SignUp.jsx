import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';

const SignUp = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminInviteToken, setAdminInviteToken] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!fullName) {
      setError('Digite seu nome completo');
      return;
    }

    if (!validateEmail(email)) {
      setError('Coloque um e-mail válido');
      return;
    }

    if (!password || password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setError('');

    // lógica de envio para o backend
    try{
       const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        adminInviteToken
       });

       const { token, role } = response.data;

       if(token){
        localStorage.setItem("token", token);
        updateUser(response.data);

        if(role === "admin"){
          navigate("/admin/dashboard");
        }else{
          navigate("/user/dashboard");
        }
       }
    }catch(error){
      if(error.response && error.response.data.message){
        setError(error.response.data.message);
      }else{
        setError("Algo deu errado. Tente novamente")
      }
    }
  };

  return (
    <AuthLayout>
      <h3 className='text-3xl font-bold text-red-700 mb-1'>Crie sua conta</h3>
      <p className='text-sm text-black mb-6'>Preencha os dados para se registrar</p>

      <form onSubmit={handleRegister} className='w-full'>
        <Input
          value={fullName}
          onChange={({ target }) => setFullName(target.value)}
          label='Nome completo'
          placeholder='Maria da Silva'
          type='text'
        />

        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label='Email'
          placeholder='exemplo@email.com'
          type='text'
        />

        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label='Senha'
          placeholder='Digite sua senha'
          type='password'
        />

        <Input
          value={adminInviteToken}
          onChange={({ target }) => setAdminInviteToken(target.value)}
          label='Código de administrador (opcional)'
          placeholder='Digite o código'
          type='text'
        />

        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

        <button type='submit' className='btn-primary'>
          CADASTRAR
        </button>

        <p className='text-[13px] text-slate-800 mt-3'>
          Já tem uma conta?{' '}
          <Link className='font-medium text-primary underline' to='/login'>
            Faça login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignUp;

import { Link } from 'react-router-dom';
import Footer from '../../components/layouts/Footer';
import { PlusCircle, Pencil, Search, Trash2, BarChart2 } from 'lucide-react';

const LandingPage = () => {
  const features = [
    { title: 'Criar Tarefas', desc: 'Adicione novas tarefas rapidamente.', icon: <PlusCircle size={32} className="mx-auto text-red-700" /> },
    { title: 'Editar Tarefas', desc: 'Modifique os detalhes das tarefas já existentes com facilidade e agilidade.', icon: <Pencil size={32} className="mx-auto text-red-700" /> },
    { title: 'Visualizar Tarefas', desc: 'Tenha uma visão clara do ciclo de vida de cada tarefa através de dashboards.', icon: <Search size={32} className="mx-auto text-red-700" /> },
    { title: 'Excluir Tarefas', desc: 'Remova tarefas que não são mais necessárias com simplicidade.', icon: <Trash2 size={32} className="mx-auto text-red-700" /> },
    { title: 'Dashboard', desc: 'Visualize estatísticas e métricas das tarefas em um painel de controle intuitivo.', icon: <BarChart2 size={32} className="mx-auto text-red-700" /> },
  ];

  return (
    <div className="w-screen min-h-screen bg-white overflow-x-hidden">

      <section className="w-full py-20 px-4 bg-gradient-to-br from-[#fff5f5] via-white to-[#fff5f5]">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold text-black mb-6 leading-tight">
            Gerenciador de <span className="text-red-700">Tarefas</span>
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Sistema completo para administrar suas tarefas com interface responsiva, 
            dashboard intuitivo e controle total sobre seus projetos.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/login" className="bg-red-700 text-white px-6 py-3 rounded hover:bg-red-800 transition">Entrar</Link>
            <Link to="/signup" className="border border-red-700 text-red-700 px-6 py-3 rounded hover:bg-red-700 hover:text-white transition">Cadastre-se</Link>
          </div>
        </div>
      </section>

      <section className="w-full max-w-5xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-2">Funcionalidades Principais</h2>
        <p className="text-center text-gray-700 mb-8 text-lg">
          Todas as ferramentas que você precisa para gerenciar suas tarefas de forma eficiente e profissional.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => (
            <div key={idx} className="bg-gray-50 border border-gray-200 rounded-md p-6 shadow-sm text-center">
              <div className="mb-2">{item.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-700">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;

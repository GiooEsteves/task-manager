import { CheckCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 mt-16 w-full">
      <div className="container mx-auto max-w-6xl">
          <div>
            <div className="flex items-center mb-4">
              <CheckCircle className="w-8 h-8 text-red-600 mr-3" />
              <h3 className="text-2xl font-bold">Gerenciador de Tarefas</h3>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Sistema completo para gerenciamento de tarefas.
            </p>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 Gerenciador de Tarefas. Giovanna Valentina.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

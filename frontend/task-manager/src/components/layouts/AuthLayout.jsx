const AuthLayout = ({ children }) => {
  return (
    <div className="flex w-screen h-screen items-center justify-center bg-white">
      <div className="w-full max-w-[480px] bg-white border border-black rounded-md px-8 py-10 shadow-lg text-center">
        <h2 className="text-2xl font-semibold text-black mb-6">
          Gerenciador de Tarefas
        </h2>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;

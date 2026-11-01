import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col flex-grow bg-naf-light">
      <main className="flex-grow">
        <section className="w-full py-20 px-6 text-center bg-gradient-to-b from-naf-blue to-[#0c1825] text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              Pare de perder dinheiro para o Leão. <br />
              <span className="text-naf-red">Simule seus impostos em segundos.</span>
            </h1>
            <p className="text-lg md:text-xl text-naf-gray mb-10 max-w-2xl mx-auto">
              Nossa calculadora inteligente ajuda profissionais autônomos a compararem os encargos entre Pessoa Física e Pessoa Jurídica para tomar a melhor decisão financeira.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => navigate(localStorage.getItem("token") ? "/" : "/login")}
                className="bg-naf-red text-white text-lg font-bold px-8 py-4 rounded-xl hover:bg-[#a62b18] transition shadow-lg hover:scale-105 cursor-pointer"
              >
                Acessar Calculadora
              </button>
              <button 
                onClick={() => navigate("/faq")}
                className="bg-transparent border-2 border-naf-gray text-white text-lg font-bold px-8 py-4 rounded-xl hover:border-white transition cursor-pointer"
              >
                Como funciona?
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

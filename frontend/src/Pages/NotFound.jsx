import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center text-center p-6">
      <p className="text-6xl font-extrabold text-naf-red mb-2">404</p>
      <h1 className="text-2xl font-bold text-naf-blue mb-2">Página não encontrada</h1>
      <p className="text-gray-700 mb-6">O endereço que você acessou não existe ou foi movido.</p>
      <Link to="/" className="bg-naf-blue text-white font-bold px-6 py-3 rounded-xl hover:bg-[#0c1825] transition-colors">
        Voltar para o início
      </Link>
    </main>
  );
}

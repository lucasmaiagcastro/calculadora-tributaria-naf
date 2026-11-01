import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const linkBase = "px-3 py-2 rounded-lg text-sm font-medium text-naf-light hover:bg-naf-red hover:text-white transition-colors duration-300 whitespace-nowrap";
const linkAtivo = "bg-white/15 text-white";

export default function Navbar() {
  const navigate = useNavigate();
  const [aberto, setAberto] = useState(false);
  const logado = Boolean(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAberto(false);
    navigate("/inicio");
  };

  const classeLink = ({ isActive }) => `${linkBase} ${isActive ? linkAtivo : ""}`;
  const fechar = () => setAberto(false);

  return (
    <nav aria-label="Menu principal" className="w-full bg-naf-blue shadow-lg border-b border-naf-gray/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            to={logado ? "/" : "/inicio"}
            onClick={fechar}
            className="text-lg sm:text-xl font-bold text-white tracking-wide hover:text-naf-gray transition-colors duration-300"
          >
            Calculadora Tributária
          </Link>

          <button
            type="button"
            onClick={() => setAberto(!aberto)}
            aria-expanded={aberto}
            aria-controls="menu-links"
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            className="md:hidden p-2 rounded-lg text-white hover:bg-naf-red transition-colors cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {aberto
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>

          <ul
            id="menu-links"
            className={`${aberto ? "flex" : "hidden"} md:flex absolute md:static top-16 left-0 right-0 z-20 flex-col md:flex-row md:items-center gap-1 bg-naf-blue md:bg-transparent p-4 md:p-0 border-b md:border-0 border-naf-gray/20`}
          >
            {logado && (
              <>
                <li><NavLink to="/" end onClick={fechar} className={classeLink}>Calculadora</NavLink></li>
                <li><NavLink to="/historico" onClick={fechar} className={classeLink}>Histórico</NavLink></li>
              </>
            )}
            <li><NavLink to="/faq" onClick={fechar} className={classeLink}>FAQ</NavLink></li>
            <li><NavLink to="/sobre" onClick={fechar} className={classeLink}>Sobre</NavLink></li>
            {logado ? (
              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="md:ml-4 px-4 py-2 border-2 border-naf-red text-naf-light rounded-lg text-sm font-bold hover:bg-naf-red hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  Sair
                </button>
              </li>
            ) : (
              <>
                <li><NavLink to="/login" onClick={fechar} className={classeLink}>Entrar</NavLink></li>
                <li>
                  <Link
                    to="/cadastro"
                    onClick={fechar}
                    className="inline-block md:ml-2 px-4 py-2 bg-naf-red text-white rounded-lg text-sm font-bold hover:bg-[#a62b18] transition-colors duration-300"
                  >
                    Criar Conta
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

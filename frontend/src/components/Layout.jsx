import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const TITULOS = {
  "/": "Calculadora",
  "/comparativo": "Resultado do comparativo",
  "/historico": "Histórico",
  "/faq": "Dúvidas frequentes",
  "/sobre": "Sobre",
  "/inicio": "Início",
  "/login": "Entrar",
  "/cadastro": "Criar conta",
  "/recuperar-senha": "Recuperar senha",
};

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = `${TITULOS[pathname] ?? "Página não encontrada"} | Calculadora Tributária NAF`;
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-naf-light">
      <a
        href="#conteudo"
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-naf-red focus:text-white focus:font-bold focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Ir para o conteúdo principal
      </a>
      <Navbar />
      <div id="conteudo" tabIndex={-1} className="flex flex-col flex-grow outline-none">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

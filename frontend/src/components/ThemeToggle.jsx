import { useState } from "react";

const aplicarTema = (escuro) => {
  document.documentElement.classList.toggle("dark", escuro);
  try {
    localStorage.setItem("tema", escuro ? "escuro" : "claro");
  } catch {
    // sem armazenamento disponível, o tema vale apenas para a sessão
  }
};

export default function ThemeToggle() {
  const [escuro, setEscuro] = useState(() => document.documentElement.classList.contains("dark"));

  const alternar = () => {
    aplicarTema(!escuro);
    setEscuro(!escuro);
  };

  return (
    <button
      type="button"
      onClick={alternar}
      aria-pressed={escuro}
      aria-label="Tema escuro"
      title={escuro ? "Mudar para o tema claro" : "Mudar para o tema escuro"}
      className="p-2 rounded-lg text-naf-light hover:bg-naf-red hover:text-white transition-colors duration-300 cursor-pointer"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        {escuro ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0l-1.414-1.414M7.05 7.05L5.636 5.636M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        )}
      </svg>
    </button>
  );
}

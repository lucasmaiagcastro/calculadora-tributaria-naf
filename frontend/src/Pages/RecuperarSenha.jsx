import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const validateForm = () => {
    if (!email) {
      setError("Por favor, preencha o campo de email.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Por favor, insira um formato de email válido.");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setError("");
    setEnviado(true);
  };

  return (
    <main className="flex flex-col items-center justify-center flex-grow bg-naf-light p-4">
      <h1
        className={`text-3xl font-bold text-center mb-6 text-naf-blue transition-all duration-[700ms] ease-out delay-[100ms]
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}
      >
        CALCULADORA DE IMPOSTO DE RENDA
      </h1>

      <div
        className={`w-full max-w-sm p-8 bg-white rounded-2xl shadow-xl border border-naf-gray/30 transition-all duration-[700ms] ease-out
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <h2
          className={`text-2xl font-bold text-center mb-2 text-naf-blue transition-all duration-[700ms] ease-out delay-[200ms]
            ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
        >
          Recuperar Senha
        </h2>

        <p
          className={`text-center text-sm text-gray-700 mb-6 transition-all duration-[700ms] ease-out delay-[300ms]
            ${isVisible ? "opacity-100" : "opacity-0"}`}
        >
          Informe seu email e enviaremos as instruções para redefinir sua senha de acesso.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div
            className={`transition-all duration-[700ms] ease-out delay-[400ms]
              ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
          >
            <label htmlFor="rec-email" className="block mb-2 text-sm font-medium text-naf-blue">
              Email Cadastrado
            </label>
            <input
              id="rec-email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "rec-email-erro" : undefined}
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              className="w-full px-4 py-2 border border-gray-500 rounded-xl focus:ring-2 focus:ring-naf-red focus:border-transparent outline-none transition delay-[80ms] duration-[400ms] ease-in-out hover:shadow-sm"
            />
            {error && <p id="rec-email-erro" role="alert" className="mt-1 text-sm text-naf-red font-medium">{error}</p>}
          </div>

          <div
            className={`transition-all duration-[700ms] ease-out delay-[500ms]
              ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
          >
            {enviado && (
              <p role="status" className="mb-3 text-sm font-bold text-green-800 text-center">
                Se este email estiver cadastrado, enviaremos instruções de recuperação em instantes.
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-naf-blue text-white font-bold py-3 rounded-xl hover:bg-[#0c1825] transition duration-[250ms] ease-in-out hover:scale-105 shadow-md cursor-pointer"
            >
              Enviar Instruções
            </button>
          </div>
        </form>

        <p
          className={`text-center text-sm text-gray-700 mt-6 transition-all duration-[700ms] ease-out delay-[600ms]
            ${isVisible ? "opacity-100" : "opacity-0"}`}
        >
          Lembrou sua senha?{" "}
          <Link to="/login" className="text-naf-red hover:underline font-bold">
            Faça login
          </Link>
        </p>
      </div>
    </main>
  );
}

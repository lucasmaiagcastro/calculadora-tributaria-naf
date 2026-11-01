import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const aviso = useLocation().state?.mensagem;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Por favor, preencha o campo de email.";
    } else if (!email.includes("@") || !email.includes(".")) {
      newErrors.email = "Por favor, informe um email válido (contendo '@' e '.').";
    }
    if (!password) newErrors.password = "Por favor, preencha o campo de senha.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});

    try {
      const response = await api.post('/auth/login', { email, password });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/");

    } catch (error) {
      const mensagemErro = error.response?.data?.error || "Erro ao conectar ao servidor.";
      setErrors({ form: mensagemErro });
    }
  };

  return (
    <main className="flex flex-col items-center justify-center flex-grow bg-naf-light p-4">
      <h1
        className={`text-3xl font-bold text-center mb-6 text-naf-blue transition-all duration-[700ms] ease-out delay-[200ms]
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}
      >
        CALCULADORA DE IMPOSTO DE RENDA
      </h1>

      <div
        className={`w-full max-w-sm p-8 bg-white rounded-2xl shadow-xl transition-all duration-[700ms] ease-out delay-[300ms] border border-naf-gray/30
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <h2
          className={`text-2xl font-bold text-center mb-6 text-naf-blue transition-all duration-[700ms] ease-out delay-[500ms] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          Login
        </h2>

        {aviso && <p role="status" className="mb-4 text-sm font-bold text-green-800 text-center">{aviso}</p>}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div
            className={`transition-all duration-[700ms] ease-out delay-[700ms] ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <label htmlFor="login-email" className="block mb-2 text-sm font-medium text-naf-blue">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "login-email-erro" : undefined}
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  const val = e.target.value;
                  if (val && val.includes("@") && val.includes(".")) {
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }
              }}
              className="w-full px-4 py-2 border border-gray-500 rounded-xl focus:ring-2 focus:ring-naf-red focus:border-transparent outline-none transition delay-[80ms] duration-[400ms] ease-in-out hover:-translate-y-1 hover:shadow-md"
            />
            {errors.email && (
              <p id="login-email-erro" role="alert" className="mt-1 text-sm text-naf-red font-medium">
                {errors.email}
              </p>
            )}
          </div>

          <div
            className={`transition-all duration-[700ms] ease-out delay-[850ms] ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <label htmlFor="login-senha" className="block mb-2 text-sm font-medium text-naf-blue">
              Senha
            </label>
            <input
              id="login-senha"
              type="password"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "login-senha-erro" : undefined}
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-500 rounded-xl focus:ring-2 focus:ring-naf-red focus:border-transparent outline-none transition delay-[80ms] duration-[400ms] ease-in-out hover:-translate-y-1 hover:shadow-md"
            />
            {errors.password && (
              <p id="login-senha-erro" role="alert" className="mt-1 text-sm text-naf-red font-medium">
                {errors.password}
              </p>
            )}
          </div>

          <div
            className={`transition-all duration-[700ms] ease-out delay-[1000ms] ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            {errors.form && (
              <p role="alert" className="mb-3 text-sm text-naf-red font-medium text-center">{errors.form}</p>
            )}
            <button
              type="submit"
              className="w-full bg-naf-red text-white font-bold py-3 rounded-xl hover:bg-[#a62b18] transition delay-[80ms] duration-[400ms] ease-in-out hover:scale-105 shadow-md"
            >
              Entrar
            </button>
          </div>
        </form>

        <p
          className={`text-center text-sm text-gray-700 mt-6 transition-all duration-[700ms] ease-out delay-[1150ms] ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          Não tem conta?{" "}
          <Link to="/cadastro" className="text-naf-red hover:underline font-bold">
            Cadastre-se
          </Link>
        </p>

        <p
          className={`text-center text-sm text-gray-700 mt-2 transition-all duration-[700ms] ease-out delay-[1250ms] ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          Esqueceu a senha?{" "}
          <Link to="/recuperar-senha" className="text-naf-red hover:underline font-bold">
            Recuperar Senha
          </Link>
        </p>
      </div>
    </main>
  );
}

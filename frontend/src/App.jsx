import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import RotaProtegida from "./components/RotaProtegida";
import Landing from "./Pages/Landing";
import Login from "./Pages/Login";
import Cadastro from "./Pages/Cadastro";
import RecuperarSenha from "./Pages/RecuperarSenha";
import Formulario from "./Pages/Formulario";
import Comparativo from "./Pages/Comparativo";
import Historico from "./Pages/Historico";
import Faq from "./Pages/Faq";
import Sobre from "./Pages/Sobre";
import NotFound from "./Pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/inicio" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/sobre" element={<Sobre />} />

          <Route element={<RotaProtegida />}>
            <Route path="/" element={<Formulario />} />
            <Route path="/comparativo" element={<Comparativo />} />
            <Route path="/historico" element={<Historico />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

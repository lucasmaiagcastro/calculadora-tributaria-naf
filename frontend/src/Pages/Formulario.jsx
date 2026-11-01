import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const PROFISSOES_FATOR_R = ["medico", "dentista"];

export default function Formulario() {
  const [renda, setRenda] = useState("");
  const [custos, setCustos] = useState("");
  const [erro, setErro] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");
  const [calculando, setCalculando] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltipRenda, setShowTooltipRenda] = useState(false);
  const [showTooltipCustos, setShowTooltipCustos] = useState(false);
  const [profissao, setProfissao] = useState("psicologo");
  const [proLabore, setProLabore] = useState("");
  const usaFatorR = PROFISSOES_FATOR_R.includes(profissao);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleRendaChange = (e) => {
    const valor = parseFloat(e.target.value);
    if (valor > 15000) {
      setErro("O valor máximo permitido é R$ 15.000,00");
      setRenda(15000);
    } else {
      setErro("");
      setRenda(e.target.value);
    }
  };

  const calcularComparativo = async () => {
    const rendaNum = parseFloat(renda);
    const custosNum = parseFloat(custos);

    const proLaboreNum = parseFloat(proLabore);

    if (isNaN(rendaNum) || isNaN(custosNum)) {
      setMensagemErro("Por favor, insira valores válidos.");
      return;
    }

    if (usaFatorR && (isNaN(proLaboreNum) || proLaboreNum < 0 || proLaboreNum > rendaNum)) {
      setMensagemErro("Informe o pró-labore/folha mensal, entre R$ 0,00 e o valor da renda.");
      return;
    }

    setMensagemErro("");
    setCalculando(true);

    try {
      const response = await api.post("/calculos", {
        tipoProfissao: profissao,
        faturamento: rendaNum,
        custos: custosNum,
        proLabore: usaFatorR ? proLaboreNum : undefined
      });

      const { impostoPF, impostoPJ, melhorOpcao, economiaMensal, fatorR, anexo } = response.data.calculo;

      const basePF = rendaNum - custosNum;
      let faixaPF = "Isento";
      let parcelaDedutivel = 0;

      if (basePF <= 2428.8) faixaPF = "Isento";
      else if (basePF <= 2826.65) { faixaPF = "7,5%"; parcelaDedutivel = 182.16; }
      else if (basePF <= 3751.05) { faixaPF = "15%"; parcelaDedutivel = 394.16; }
      else if (basePF <= 4664.68) { faixaPF = "22,5%"; parcelaDedutivel = 675.49; }
      else { faixaPF = "27,5%"; parcelaDedutivel = 908.73; }

      let taxaSimples = profissao === "advogado" ? 0.045 : 0.06;
      if (usaFatorR) taxaSimples = anexo === "III" ? 0.06 : 0.155;
      const aliquotaPJ = `${(taxaSimples * 100).toString().replace(".", ",")}%`;
      const proLaboreBase = usaFatorR ? proLaboreNum : rendaNum * 0.28;
      const salarioMin = 1621;
      const salarioBase = Math.max(proLaboreBase, salarioMin);
      const inss = salarioBase * 0.11;

      const siglaVencedora = melhorOpcao.includes("PJ") ? "PJ" : "PF";

      const resultado = {
        pf: { base: basePF, faixa: faixaPF, parcelaDedutivel, imposto: impostoPF },
        pj: { simples: rendaNum * taxaSimples, aliquota: aliquotaPJ, salarioBase, inss, total: impostoPJ, fatorR, anexo },
        maisVantajoso: melhorOpcao,
        siglaVencedora,
        diferenca: economiaMensal,
        profissao
      };

      navigate("/comparativo", { state: { resultado } });

    } catch (error) {
      console.error("Erro ao salvar comparativo no banco:", error);
      const mensagemApi = error.response?.data?.error || "Erro ao processar o comparativo no servidor.";
      setMensagemErro(mensagemApi);
    } finally {
      setCalculando(false);
    }
  };

  return (
    <div className="flex flex-col flex-grow bg-[#EFEFEF]">
      <main className="flex-grow flex flex-col items-center py-10 px-4">
        {/* CABEÇALHO DA PÁGINA */}
        <div className={`text-center mb-8 transition-all duration-[700ms] ease-out delay-[200ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <h1 className="text-3xl font-bold text-[#132436] mb-2">Descubra onde você paga menos impostos</h1>
          <p className="text-[#B2B2B2] font-medium max-w-xl mx-auto">
            Preencha os dados abaixo e o sistema fará um raio-x completo comparando o regime como Autônomo (PF) e como Empresa (PJ).
          </p>
        </div>

        {/* CONTAINER DOS INPUTS */}
        <div
          className={`w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-gray-200 transition-all duration-[700ms] ease-out delay-[400ms] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="w-full">
              <label className="block mb-2 text-sm font-medium text-[#132436]">Sua Profissão</label>
              <select
                value={profissao}
                onChange={(e) => setProfissao(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#CD371F] outline-none transition cursor-pointer"
              >
                <option value="psicologo">Psicólogo(a)</option>
                <option value="arquiteto">Arquiteto(a)</option>
                <option value="advogado">Advogado(a)</option>
                <option value="medico">Médico(a)</option>
                <option value="dentista">Dentista</option>
              </select>
            </div>

            <div className="w-full">
              <div className="relative flex items-center gap-1 mb-2">
                <label className="text-sm font-medium text-[#132436]">Renda Mensal (R$)</label>
                <button
                  type="button"
                  className="text-gray-400 hover:text-[#132436] focus:outline-none cursor-help"
                  onMouseEnter={() => setShowTooltipRenda(true)}
                  onMouseLeave={() => setShowTooltipRenda(false)}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                </button>
                {showTooltipRenda && <div className="absolute z-10 w-64 p-3 text-sm text-white bg-[#132436] rounded-xl shadow-lg -top-2 left-full ml-2 border border-gray-200">Sua receita bruta total prevista para o mês.</div>}
              </div>
              <input
                type="number"
                value={renda}
                onChange={handleRendaChange}
                max="15000"
                placeholder="Ex: 5000"
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#CD371F] outline-none transition"
              />
              {erro && <p className="text-[#CD371F] text-xs mt-1 absolute font-medium">{erro}</p>}
            </div>

            <div className="w-full">
              <div className="relative flex items-center gap-1 mb-2">
                <label className="text-sm font-medium text-[#132436]">Custos Dedutíveis (R$)</label>
                <button
                  type="button"
                  className="text-gray-400 hover:text-[#132436] focus:outline-none cursor-help"
                  onMouseEnter={() => setShowTooltipCustos(true)}
                  onMouseLeave={() => setShowTooltipCustos(false)}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                </button>
                {showTooltipCustos && <div className="absolute z-10 w-64 p-3 text-sm text-white bg-[#132436] rounded-xl shadow-lg -top-2 right-full mr-2 border border-gray-200">Despesas do seu negócio (aluguel, internet, etc). Usado apenas para abater a base da PF.</div>}
              </div>
              <input
                type="number"
                value={custos}
                onChange={(e) => setCustos(e.target.value)}
                placeholder="Ex: 800"
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#CD371F] outline-none transition"
              />
            </div>

            {usaFatorR && (
              <div className="w-full">
                <label htmlFor="pro-labore" className="block mb-2 text-sm font-medium text-[#132436]">Pró-labore / Folha de Pagamento Mensal (R$)</label>
                <input
                  id="pro-labore"
                  type="number"
                  value={proLabore}
                  onChange={(e) => setProLabore(e.target.value)}
                  placeholder="Ex: 1500"
                  className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#CD371F] outline-none transition"
                />
              </div>
            )}
          </div>

          <div className="px-6 md:px-8 pb-8">
            <button onClick={calcularComparativo} disabled={calculando} className="w-full disabled:opacity-70 disabled:cursor-wait bg-[#CD371F] text-white font-bold py-4 rounded-xl hover:bg-[#a62b18] hover:scale-[1.01] transition-all duration-[400ms] ease-out shadow-md text-lg cursor-pointer">
              {calculando ? "Calculando..." : "Analisar Vantagem Tributária"}
            </button>
            {mensagemErro && <p className="text-[#CD371F] font-medium text-center mt-4">{mensagemErro}</p>}
          </div>

        </div>
      </main>
    </div>
  );
}

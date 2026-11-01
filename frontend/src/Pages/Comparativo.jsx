import { useState, useEffect } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import html2pdf from "html2pdf.js";
import GraficoComparativo from "../components/GraficoComparativo";
import MemoriaCalculo from "../components/MemoriaCalculo";
import { brl, percentual } from "../utils/formatar";

const NOMES_PROFISSAO = {
  psicologo: "Psicólogo(a)",
  arquiteto: "Arquiteto(a)",
  advogado: "Advogado(a)",
  medico: "Médico(a)",
  dentista: "Dentista",
};

export default function Comparativo() {
  const { state } = useLocation();

  if (!state?.resultado) {
    return <Navigate to="/" replace />;
  }

  return <ResultadoComparativo resultado={state.resultado} />;
}

function ResultadoComparativo({ resultado }) {
  const { profissao } = resultado;
  const [geradoEm] = useState(() => new Date());
  const [isVisible, setIsVisible] = useState(false);
  const [mostrarEmail, setMostrarEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [mensagemEnvio, setMensagemEnvio] = useState("");
  const [gerandoPdf, setGerandoPdf] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const enviarEmail = () => {
    if (!email.includes("@")) {
      setMensagemEnvio("Por favor, insira um e-mail válido.");
      return;
    }
    setMensagemEnvio(`Resultados simulados e enviados para ${email} com sucesso!`);
    setEmail("");
  };

  const gerarPDF = async () => {
    setGerandoPdf(true);
    const elemento = document.getElementById("resultado-comparativo");
    
    if (!elemento) {
      console.error("Erro interno: A div do PDF não foi encontrada.");
      setGerandoPdf(false);
      return;
    }

    try {
      const opcoes = {
        margin:       10,
        filename:     `Comparativo_Tributario_${profissao}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true }, 
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opcoes).from(elemento).save();
    } catch (error) {
      console.error("Falha ao processar o arquivo PDF:", error);
    } finally {
      setGerandoPdf(false);
    }
  };

  return (
    <div className="flex flex-col flex-grow bg-[#EFEFEF]">
      <main className="flex-grow flex flex-col items-center py-10 px-4">
        <div className={`text-center mb-8 transition-all duration-[700ms] ease-out delay-[200ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <h1 className="text-3xl font-bold text-[#132436] mb-2">Resultado do comparativo</h1>
          <Link to="/" className="font-bold text-[#a62b18] underline hover:text-[#7f1f12]">Fazer nova simulação</Link>
        </div>

        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-gray-200">
            <div className="border-t border-gray-200 bg-gray-50 rounded-b-3xl">
              <div id="resultado-comparativo" className="p-6 md:p-8 bg-[#ffffff]">
                <header className="mb-8 rounded-2xl bg-[#132436] text-[#ffffff] p-6 text-center">
                  <p className="text-xs uppercase tracking-widest text-[#d1d5db]">NAF · Núcleo de Apoio Contábil e Fiscal · Unichristus</p>
                  <h2 className="text-2xl font-extrabold mt-1">Relatório Comparativo PF x PJ</h2>
                  <p className="text-sm mt-2 text-[#e5e7eb]">
                    Gerado em {geradoEm.toLocaleDateString("pt-BR")} às {geradoEm.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <p className="text-sm mt-1 text-[#e5e7eb]">
                    {NOMES_PROFISSAO[profissao] ?? profissao} · Renda mensal {brl(resultado.renda)} · Custos {brl(resultado.custos)}
                    {resultado.proLabore !== null && ` · Pró-labore ${brl(resultado.proLabore)}`}
                  </p>
                </header>

                <div className="mb-8 p-6 rounded-2xl border-2 text-center shadow-sm" style={{ borderColor: resultado.siglaVencedora === 'PJ' ? '#22c55e' : '#3b82f6', backgroundColor: resultado.siglaVencedora === 'PJ' ? '#f0fdf4' : '#eff6ff' }}>
                  <h3 className="text-xl font-bold text-[#1f2937] mb-1">A melhor opção para você é:</h3>
                  <p className="text-3xl font-extrabold mb-2" style={{ color: resultado.siglaVencedora === 'PJ' ? '#16a34a' : '#2563eb' }}>{resultado.maisVantajoso}</p>
                  <p className="text-[#374151] font-medium">Atuando como {resultado.siglaVencedora}, você tem uma <span className="font-bold underline decoration-2">economia de {brl(resultado.diferenca)}</span> todos os meses.</p>
                </div>

                <h2 className="text-center font-bold text-[#132436] mb-4 uppercase tracking-wider text-sm">Resumo Detalhado dos Cálculos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-xl border-2 shadow-md" style={{ borderColor: resultado.siglaVencedora === 'PF' ? '#3b82f6' : '#e5e7eb', backgroundColor: resultado.siglaVencedora === 'PF' ? '#ffffff' : '#f3f4f6', opacity: 1 }}>
                    <h3 className="font-bold text-xl text-[#132436] mb-4 border-b border-[#e5e7eb] pb-2 flex items-center justify-between">Pessoa Física (PF) {resultado.siglaVencedora === 'PF' && <span className="text-xs bg-[#eff6ff] text-[#1d4ed8] px-2 py-1 rounded-full uppercase">Recomendado</span>}</h3>
                    <div className="space-y-3 text-sm text-[#374151]">
                      <div className="flex justify-between"><span>Base de Cálculo:</span> <span className="font-semibold">{brl(resultado.pf.base)}</span></div>
                      <div className="flex justify-between"><span>Faixa IRPF:</span> <span className="font-semibold">{resultado.pf.faixa}</span></div>
                      <div className="flex justify-between"><span>Dedução Permitida:</span> <span className="font-semibold text-[#15803d]">- {brl(resultado.pf.parcelaDedutivel)}</span></div>
                    </div>
                    <div className="mt-5 pt-3 border-t border-[#e5e7eb] flex justify-between items-end"><span className="font-bold text-[#132436]">Custo Mensal:</span><span className="text-2xl font-black text-[#CD371F]">{brl(resultado.pf.imposto)}</span></div>
                  </div>

                  <div className="p-5 rounded-xl border-2 shadow-md" style={{ borderColor: resultado.siglaVencedora === 'PJ' ? '#22c55e' : '#e5e7eb', backgroundColor: resultado.siglaVencedora === 'PJ' ? '#ffffff' : '#f3f4f6', opacity: 1 }}>
                    <h3 className="font-bold text-xl text-[#132436] mb-4 border-b border-[#e5e7eb] pb-2 flex items-center justify-between">Pessoa Jurídica (PJ) {resultado.siglaVencedora === 'PJ' && <span className="text-xs bg-[#f0fdf4] text-[#15803d] px-2 py-1 rounded-full uppercase">Recomendado</span>}</h3>
                    <div className="space-y-3 text-sm text-[#374151]">
                      {resultado.pj.anexo && (
                        <>
                          <div className="flex justify-between"><span>Fator R:</span> <span className="font-semibold">{percentual(resultado.pj.fatorR)}</span></div>
                          <div className="flex justify-between"><span>Anexo aplicado:</span> <span className="font-semibold">Anexo {resultado.pj.anexo}</span></div>
                        </>
                      )}
                      <div className="flex justify-between"><span>Simples ({resultado.pj.aliquota}):</span> <span className="font-semibold">{brl(resultado.pj.simples)}</span></div>
                      <div className="flex justify-between"><span>Pró-labore base:</span> <span className="font-semibold">{brl(resultado.pj.salarioBase)}</span></div>
                      <div className="flex justify-between"><span>INSS Mensal (11%):</span> <span className="font-semibold">{brl(resultado.pj.inss)}</span></div>
                    </div>
                    <div className="mt-5 pt-3 border-t border-[#e5e7eb] flex justify-between items-end"><span className="font-bold text-[#132436]">Custo Mensal:</span><span className="text-2xl font-black text-[#CD371F]">{brl(resultado.pj.total)}</span></div>
                  </div>
                </div>

                <div className="mt-8">
                  <GraficoComparativo impostoPF={resultado.pf.imposto} impostoPJ={resultado.pj.total} />
                  <MemoriaCalculo resultado={resultado} />
                  <p className="text-xs text-[#4b5563] border-t border-[#e5e7eb] pt-4">
                    Aviso: os valores apresentados são estimativas para apoio à decisão, calculadas com as tabelas e alíquotas de 2026, e não substituem a orientação de um contador. Projeto do NAF Unichristus.
                  </p>
                </div>
              </div>

              <div className="px-6 md:px-8 pb-8 pt-4 flex flex-col gap-4 border-t border-gray-200">
                <button onClick={gerarPDF} disabled={gerandoPdf} className={`w-full bg-[#132436] text-white font-bold py-3 rounded-xl transition-all duration-[400ms] shadow-md flex items-center justify-center gap-2 cursor-pointer ${gerandoPdf ? 'opacity-70 cursor-wait' : 'hover:bg-[#0c1825] hover:-translate-y-1'}`}>
                  <svg className={`w-5 h-5 ${gerandoPdf ? 'animate-bounce' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  {gerandoPdf ? "Processando e Baixando PDF..." : "Baixar Relatório Oficial em PDF"}
                </button>

                <div className="text-center mt-2">
                  <button onClick={() => setMostrarEmail(!mostrarEmail)} aria-expanded={mostrarEmail} aria-controls="form-email" className="text-sm font-bold text-[#374151] hover:text-[#132436] transition-colors underline cursor-pointer bg-transparent border-none">Deseja enviar os resultados para o seu e-mail?</button>
                </div>

                {mostrarEmail && (
                  <div id="form-email" className="mt-2 space-y-3 p-4 bg-white border border-gray-300 rounded-xl shadow-sm">
                    <label htmlFor="email-resultado" className="block text-sm font-medium text-[#132436]">Qual e-mail deve receber a simulação?</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input id="email-resultado" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contato@exemplo.com" className="flex-grow border border-gray-300 px-4 py-2 rounded-xl focus:ring-2 focus:ring-[#132436] outline-none text-sm" />
                      <button onClick={enviarEmail} className="bg-[#CD371F] text-white px-6 py-2 rounded-xl hover:bg-[#a62b18] transition text-sm font-bold cursor-pointer shadow-sm">Enviar Agora</button>
                    </div>
                    {mensagemEnvio && <p role="status" className="text-sm font-bold text-green-700">{mensagemEnvio}</p>}
                  </div>
                )}
              </div>

              <div className="px-6 md:px-8 pb-8 pt-6 border-t border-gray-200 bg-white rounded-b-3xl">
                <div className="text-center mb-4">
                  <h2 className="font-bold text-[#132436] uppercase tracking-wider text-sm flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 text-[#CD371F]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                    Conteúdo Recomendado Para Você
                  </h2>
                  <p className="text-sm text-gray-500">Separamos este vídeo do Sebrae para te ajudar a entender melhor o regime {resultado.siglaVencedora}.</p>
                </div>
                
                <div className="aspect-video w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg border border-gray-200">
                  {resultado.siglaVencedora === 'PJ' ? (
                    <iframe className="w-full h-full" src="https://www.youtube.com/embed/yMlNDLDlk2c" title="Como funciona o Simples Nacional" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                  ) : (
                    <iframe className="w-full h-full" src="https://www.youtube.com/embed/QtPQq3di4xI" title="Como fazer o Carnê-Leão e Livro Caixa" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                  )}
                </div>
              </div>
            </div>
        </div>
      </main>
    </div>
  );
}

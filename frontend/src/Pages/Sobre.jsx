import { useState } from "react";
import api from "../services/api";

export default function Sobre() {
  const [formData, setFormData] = useState({ nome: "", email: "", mensagem: "" });
  const [enviando, setEnviando] = useState(false);
  const [retorno, setRetorno] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setRetorno(null);

    try {
      await api.post("/send-email", formData);
      setRetorno({ ok: true, texto: "Mensagem enviada com sucesso ao NAF!" });
      setFormData({ nome: "", email: "", mensagem: "" });
    } catch (error) {
      console.error("Erro ao enviar mensagem ao NAF:", error);
      setRetorno({ ok: false, texto: "Houve um erro ao enviar a mensagem. Tente novamente." });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="flex-grow flex flex-col items-center py-10 px-4 md:px-6">
      <section className="w-full max-w-6xl text-center mb-10">
        <h1 className="text-3xl font-bold text-naf-blue mb-3">Sobre a Calculadora</h1>
        <p className="text-gray-700 font-medium text-lg max-w-3xl mx-auto">
          Projeto do Núcleo de Apoio Contábil e Fiscal (NAF) da Unichristus que compara a carga tributária de profissionais autônomos como Pessoa Física (IRPF) e como Pessoa Jurídica (Simples Nacional). Os valores são estimativas para apoio à decisão e não substituem a orientação de um contador.
        </p>
      </section>

      <section className="w-full max-w-6xl bg-white rounded-3xl shadow-md border border-naf-gray/20 p-8 mb-12">
          <h2 className="text-2xl font-bold text-naf-blue mb-6 border-b border-naf-gray/20 pb-4">Como os cálculos são feitos</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h3 className="text-lg font-bold text-naf-red mb-3">Pessoa Física (PF)</h3>
              <p className="text-sm text-gray-700 mb-4">
                A tributação da PF utiliza a tabela progressiva do IRPF. O sistema abate os seus <strong>custos mensais</strong> (despesas de livro caixa) da sua <strong>renda</strong>. O valor restante é a "Base de Cálculo", que é encaixada na tabela abaixo:
              </p>
              
              <div className="overflow-x-auto rounded-xl border border-naf-gray/30">
                <table className="min-w-full text-xs text-gray-700">
                  <caption className="sr-only">Tabela progressiva mensal do IRPF</caption>
                  <thead className="bg-naf-blue text-white">
                    <tr>
                      <th scope="col" className="py-2 px-3 text-left">Base (R$)</th>
                      <th scope="col" className="py-2 px-3 text-left">Alíquota</th>
                      <th scope="col" className="py-2 px-3 text-left">Deduzir (R$)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-gray-50 border-b border-naf-gray/20">
                      <td className="py-2 px-3">Até 2.428,80</td>
                      <td className="py-2 px-3 font-semibold text-green-800">Isento</td>
                      <td className="py-2 px-3">—</td>
                    </tr>
                    <tr className="border-b border-naf-gray/20">
                      <td className="py-2 px-3">2.428,81 a 2.826,65</td>
                      <td className="py-2 px-3">7,5%</td>
                      <td className="py-2 px-3">182,16</td>
                    </tr>
                    <tr className="bg-gray-50 border-b border-naf-gray/20">
                      <td className="py-2 px-3">2.826,66 a 3.751,05</td>
                      <td className="py-2 px-3">15%</td>
                      <td className="py-2 px-3">394,16</td>
                    </tr>
                    <tr className="border-b border-naf-gray/20">
                      <td className="py-2 px-3">3.751,06 a 4.664,68</td>
                      <td className="py-2 px-3">22,5%</td>
                      <td className="py-2 px-3">675,49</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="py-2 px-3">Acima de 4.664,68</td>
                      <td className="py-2 px-3 font-semibold text-naf-red">27,5%</td>
                      <td className="py-2 px-3">908,73</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-naf-red mb-3">Pessoa Jurídica (PJ)</h3>
              <p className="text-sm text-gray-700 mb-4">
                A tributação PJ é simulada com base no <strong>Simples Nacional</strong>. A alíquota inicial varia conforme a sua categoria profissional, além de englobar a contribuição previdenciária obrigatória (INSS).
              </p>
              <ul className="space-y-3 text-sm text-gray-700 bg-naf-light/50 p-5 rounded-xl border border-naf-gray/20">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-naf-blue mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span><strong>Psicólogos e Arquitetos (Anexo III):</strong> Iniciam com 6% de imposto sobre o faturamento.</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-naf-blue mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span><strong>Advogados (Anexo IV):</strong> Iniciam com 4,5% de imposto sobre o faturamento.</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-naf-blue mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span><strong>Médicos e Dentistas (Fator R):</strong> Fator R = pró-labore ÷ faturamento. Com 28% ou mais, aplica-se o Anexo III (6%); abaixo disso, o Anexo V (15,5%).</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-naf-blue mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span><strong>INSS (Pró-labore):</strong> Calculado em 11% sobre o pró-labore (respeitando o mínimo de 1 salário mínimo vigente). Para Médicos e Dentistas, usa-se o pró-labore informado; para as demais profissões, 28% do faturamento.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

      <section className="w-full max-w-2xl bg-white rounded-3xl shadow-lg border border-naf-gray/20 p-8 mb-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-naf-blue">Fale com o NAF</h2>
          <p className="text-sm text-gray-700 mt-1">Sua situação é muito complexa? Envie uma mensagem para nossa equipe.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contato-nome" className="block text-sm font-medium text-naf-blue mb-1">Nome Completo</label>
              <input id="contato-nome" type="text" name="nome" value={formData.nome} onChange={handleChange} required className="w-full border border-gray-500 px-4 py-2 rounded-xl focus:ring-2 focus:ring-naf-red outline-none transition" />
            </div>
            <div>
              <label htmlFor="contato-email" className="block text-sm font-medium text-naf-blue mb-1">E-mail</label>
              <input id="contato-email" type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border border-gray-500 px-4 py-2 rounded-xl focus:ring-2 focus:ring-naf-red outline-none transition" />
            </div>
          </div>
          <div>
            <label htmlFor="contato-mensagem" className="block text-sm font-medium text-naf-blue mb-1">Sua Mensagem / Dúvida</label>
            <textarea id="contato-mensagem" name="mensagem" value={formData.mensagem} onChange={handleChange} required rows="3" className="w-full border border-gray-500 px-4 py-2 rounded-xl focus:ring-2 focus:ring-naf-red outline-none transition resize-none"></textarea>
          </div>
          <button
            type="submit"
            disabled={enviando}
            className="cursor-pointer w-full bg-naf-blue text-white py-3 rounded-xl hover:bg-[#0c1825] transition-colors text-base font-bold shadow-md disabled:opacity-70 disabled:cursor-wait"
          >
            {enviando ? "Enviando para o NAF..." : "Enviar Mensagem"}
          </button>
          <p role="status" className={`text-sm font-bold text-center ${retorno?.ok ? "text-green-800" : "text-naf-red"}`}>
            {retorno?.texto}
          </p>
        </form>
      </section>
    </main>
  );
}

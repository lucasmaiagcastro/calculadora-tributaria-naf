import { useState } from "react";

const faqs = [
  {
    pergunta: "Para quem é esta calculadora?",
    resposta: "Para Psicólogos, Arquitetos, Advogados, Médicos e Dentistas que desejam descobrir se é mais barato atuar como Pessoa Física ou abrir um CNPJ (Pessoa Jurídica)."
  },
  {
    pergunta: "Quais tributos são considerados no comparativo?",
    resposta: "Para Pessoa Física, utilizamos a Tabela Progressiva do IRPF abatendo as despesas do Livro Caixa. Para Pessoa Jurídica, aplicamos as alíquotas iniciais do Simples Nacional (Anexos III, IV ou V, conforme a profissão) e o INSS de 11% sobre o pró-labore."
  },
  {
    pergunta: "Vale a pena abrir CNPJ ganhando pouco?",
    resposta: "Muitas vezes, sim! É um mito que CNPJ é só para quem ganha muito. O comparativo mostra o ponto de virada em que os 27,5% da Pessoa Física se tornam mais caros que os impostos do Simples Nacional."
  },
  {
    pergunta: "O que é o Fator R?",
    resposta: "É a razão entre a folha de pagamento (incluindo o pró-labore) e a receita. Para Médicos e Dentistas, se o Fator R for igual ou maior que 28%, a atividade é tributada pelo Anexo III (6% na primeira faixa); abaixo disso, pelo Anexo V (15,5%). Por isso, para essas profissões a calculadora pede o pró-labore mensal e exibe o Fator R e o Anexo aplicado no resultado."
  },
  {
    pergunta: "A calculadora substitui um contador?",
    resposta: "Não. Ela é uma ferramenta de simulação e apoio à decisão. Após descobrir o regime mais vantajoso, contrate um contador habilitado para abrir a empresa e cuidar das obrigações fiscais."
  },
  {
    pergunta: "Qual é o ano-base dos cálculos da ferramenta?",
    resposta: "Os cálculos usam as tabelas do IRPF, o salário mínimo (R$ 1.621,00) e as alíquotas do Simples Nacional configuradas para o ano-calendário de 2026."
  },
  {
    pergunta: "O sistema armazena meus dados financeiros?",
    resposta: "Sim. Cada simulação (profissão, renda, custos, pró-labore e resultados) é salva na sua conta para consulta na página Histórico. Os dados são vinculados ao seu usuário e não são compartilhados."
  }
];

export default function Faq() {
  const [aberto, setAberto] = useState(null);

  return (
    <main className="flex-grow w-full py-12 px-6 bg-naf-light">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-naf-blue mb-2">Dúvidas Frequentes (FAQ)</h1>
        <p className="text-center text-gray-700 mb-10 font-medium">Entenda como a nossa ferramenta pode ajudar na sua rotina</p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={faq.pergunta} className="bg-white border border-naf-gray/20 rounded-2xl shadow-sm overflow-hidden">
              <h2>
                <button
                  type="button"
                  onClick={() => setAberto(aberto === index ? null : index)}
                  aria-expanded={aberto === index}
                  aria-controls={`faq-resposta-${index}`}
                  className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition cursor-pointer"
                >
                  <span className="font-bold text-naf-blue text-lg">{faq.pergunta}</span>
                  <svg
                    className={`w-6 h-6 shrink-0 text-naf-red transform transition-transform duration-300 ${aberto === index ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </h2>
              <div
                id={`faq-resposta-${index}`}
                hidden={aberto !== index}
                className="px-6 pb-6 text-gray-700 text-sm md:text-base leading-relaxed"
              >
                {faq.resposta}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

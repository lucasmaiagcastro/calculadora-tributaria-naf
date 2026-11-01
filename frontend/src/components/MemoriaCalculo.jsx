import { brl } from "../utils/formatar";

function Tabela({ titulo, linhas, total }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-[#374151] border border-[#e5e7eb]">
        <caption className="text-left font-bold text-[#132436] text-base mb-2">{titulo}</caption>
        <thead className="bg-[#132436] text-[#ffffff]">
          <tr>
            <th scope="col" className="py-2 px-3 text-left">Tributo</th>
            <th scope="col" className="py-2 px-3 text-right">Base de cálculo</th>
            <th scope="col" className="py-2 px-3 text-right">Alíquota</th>
            <th scope="col" className="py-2 px-3 text-right">Valor</th>
          </tr>
        </thead>
        <tbody>
          {linhas.map((l) => (
            <tr key={l.tributo} className="border-t border-[#e5e7eb]">
              <th scope="row" className="py-2 px-3 text-left font-semibold">
                {l.tributo}
                {l.nota && <span className="block text-xs font-normal text-[#4b5563]">{l.nota}</span>}
              </th>
              <td className="py-2 px-3 text-right">{brl(l.base)}</td>
              <td className="py-2 px-3 text-right">{l.aliquota}</td>
              <td className="py-2 px-3 text-right font-semibold">{brl(l.valor)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-[#132436] bg-[#f3f4f6]">
            <th scope="row" colSpan={3} className="py-2 px-3 text-left">Total mensal</th>
            <td className="py-2 px-3 text-right font-bold text-[#132436]">{brl(total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default function MemoriaCalculo({ resultado }) {
  const { pf, pj, renda } = resultado;
  const rotuloSimples = pj.anexo ? `Simples Nacional (Anexo ${pj.anexo})` : "Simples Nacional";

  return (
    <section className="mb-8">
      <h2 className="text-center font-bold text-[#132436] mb-4 uppercase tracking-wider text-sm">Memória de cálculo</h2>
      <div className="grid grid-cols-1 gap-6">
        <Tabela
          titulo="Pessoa Física (PF)"
          total={pf.imposto}
          linhas={[
            {
              tributo: "IRPF (tabela progressiva)",
              nota: `Base = renda − custos. Parcela a deduzir: ${brl(pf.parcelaDedutivel)}`,
              base: pf.base,
              aliquota: pf.faixa,
              valor: pf.imposto,
            },
          ]}
        />
        <Tabela
          titulo="Pessoa Jurídica (PJ)"
          total={pj.total}
          linhas={[
            { tributo: rotuloSimples, nota: "Base = faturamento mensal", base: renda, aliquota: pj.aliquota, valor: pj.simples },
            { tributo: "INSS sobre o pró-labore", nota: "Mínimo de 1 salário mínimo (R$ 1.621,00)", base: pj.salarioBase, aliquota: "11%", valor: pj.inss },
          ]}
        />
      </div>
    </section>
  );
}

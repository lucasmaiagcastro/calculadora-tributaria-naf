import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { brl } from "../utils/formatar";

const COR_PF = "#1d4ed8";
const COR_PJ = "#15803d";

export default function GraficoComparativo({ impostoPF, impostoPJ }) {
  const dados = [
    { regime: "Pessoa Física (PF)", valor: impostoPF, cor: COR_PF },
    { regime: "Pessoa Jurídica (PJ)", valor: impostoPJ, cor: COR_PJ },
  ];

  return (
    <figure className="mb-8">
      <figcaption className="text-center font-bold text-[#132436] mb-2 uppercase tracking-wider text-sm">
        Imposto mensal: PF x PJ
      </figcaption>
      <div role="img" aria-label={`Gráfico de barras: imposto mensal de ${brl(impostoPF)} como PF e ${brl(impostoPJ)} como PJ`}>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={dados} margin={{ top: 24, right: 16, left: 16, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d1d5db" />
            <XAxis dataKey="regime" tick={{ fill: "#132436", fontSize: 13 }} />
            <YAxis tickFormatter={(v) => brl(v)} tick={{ fill: "#374151", fontSize: 12 }} width={90} />
            <Bar dataKey="valor" isAnimationActive={false} radius={[6, 6, 0, 0]} maxBarSize={110}>
              {dados.map((d) => <Cell key={d.regime} fill={d.cor} />)}
              <LabelList dataKey="valor" position="top" formatter={(v) => brl(v)} fill="#132436" fontSize={13} fontWeight={700} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}

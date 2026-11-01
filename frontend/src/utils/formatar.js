const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export const brl = (valor) => moeda.format(valor);

export const percentual = (valor) =>
  `${(valor * 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;

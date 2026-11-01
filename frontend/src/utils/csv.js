// Separador ";" e BOM para o Excel em português abrir com acentos e colunas corretos.
const SEPARADOR = ";";

const celula = (valor) => {
  if (valor === null || valor === undefined) return "";
  let texto = String(valor);
  // Evita que o Excel interprete o conteúdo como fórmula.
  if (/^[=+\-@\t\r]/.test(texto) && typeof valor === "string") texto = `'${texto}`;
  return /[";\n\r]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
};

export const numeroCsv = (valor) =>
  valor === null || valor === undefined ? "" : Number(valor).toFixed(2).replace(".", ",");

export function baixarCsv(nomeArquivo, cabecalho, linhas) {
  const conteudo = [cabecalho, ...linhas].map((linha) => linha.map(celula).join(SEPARADOR)).join("\r\n");
  const blob = new Blob(["﻿" + conteudo], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nomeArquivo;
  link.click();
  URL.revokeObjectURL(url);
}

const prisma = require('../config/prisma');

const PROFISSOES_FATOR_R = ['medico', 'dentista'];
const LIMITE_FATOR_R = 0.28;
const RENDA_MAXIMA = 15000;

// Com renda mensal limitada a R$ 15.000, a receita dos 12 meses não passa de R$ 180.000,
// o que mantém o cálculo sempre na 1ª faixa do Simples Nacional.
const ALIQUOTA_ANEXO_III = 0.06;
const ALIQUOTA_ANEXO_V = 0.155;

const calculoController = {
  create: async (req, res) => {
    try {
      const { tipoProfissao, faturamento, custos, proLabore } = req.body;
      const userId = req.userId;

      if (!tipoProfissao || faturamento === undefined) {
        return res.status(400).json({ error: "Profissão e Faturamento são obrigatórios." });
      }

      const rendaNum = parseFloat(faturamento);
      const custosNum = custos ? parseFloat(custos) : 0;

      if (isNaN(rendaNum) || rendaNum < 0 || rendaNum > RENDA_MAXIMA) {
        return res.status(400).json({ error: "A renda mensal deve estar entre R$ 0,00 e R$ 15.000,00." });
      }

      const usaFatorR = PROFISSOES_FATOR_R.includes(tipoProfissao.toLowerCase());
      let proLaboreNum = null;
      let fatorR = null;
      let anexo = null;

      if (usaFatorR) {
        proLaboreNum = parseFloat(proLabore);
        if (isNaN(proLaboreNum) || proLaboreNum < 0 || proLaboreNum > rendaNum) {
          return res.status(400).json({ error: "Informe o pró-labore/folha mensal, entre R$ 0,00 e o valor da renda." });
        }
        fatorR = rendaNum > 0 ? proLaboreNum / rendaNum : 0;
        anexo = fatorR >= LIMITE_FATOR_R ? 'III' : 'V';
      }

      // --- REGRA DE NEGÓCIO DA PESSOA FÍSICA (IRPF 2026) ---
      const basePF = rendaNum - custosNum;
      let impostoPF = 0;
      let faixaPF = "Isento";

      if (basePF <= 2428.8) {
        faixaPF = "Isento";
      } else if (basePF <= 2826.65) {
        impostoPF = basePF * 0.075 - 182.16;
        faixaPF = "7,5%";
      } else if (basePF <= 3751.05) {
        impostoPF = basePF * 0.15 - 394.16;
        faixaPF = "15%";
      } else if (basePF <= 4664.68) {
        impostoPF = basePF * 0.225 - 675.49;
        faixaPF = "22,5%";
      } else {
        impostoPF = basePF * 0.275 - 908.73;
        faixaPF = "27,5%";
      }
      impostoPF = impostoPF <= 0 ? 0 : impostoPF;

      // --- REGRA DE NEGÓCIO DA PESSOA JURÍDICA (Simples Nacional 2026) ---
      let simples = 0;
      if (usaFatorR) {
        simples = rendaNum * (anexo === 'III' ? ALIQUOTA_ANEXO_III : ALIQUOTA_ANEXO_V);
      } else if (tipoProfissao.toLowerCase() === "advogado") {
        simples = rendaNum * 0.045; // Anexo IV: 4,5%
      } else {
        // Psicólogo e Arquiteto - Anexo III (Considerando o Fator R ativo no front)
        simples = rendaNum * 0.06; // 6%
      }

      const salarioMin = 1621; // Salário mínimo projetado para 2026
      const proLaboreBase = usaFatorR ? proLaboreNum : rendaNum * 0.28;
      const salarioBase = Math.max(proLaboreBase, salarioMin);
      const inss = salarioBase * 0.11; // 11% obrigatório sobre o pró-labore
      const impostoPJ = simples + inss;

      // --- COMPARAÇÃO DE VANTAGEM TRIBUTÁRIA ---
      const economiaMensal = Math.abs(impostoPJ - impostoPF);
      const melhorOpcao = impostoPJ < impostoPF ? "Pessoa Jurídica (PJ)" : "Pessoa Física (PF)";

      const novoCalculo = await prisma.calculo.create({
        data: {
          userId,
          tipoProfissao,
          faturamento: rendaNum,
          custos: custosNum,
          proLabore: proLaboreNum,
          fatorR,
          anexo,
          impostoPF,
          impostoPJ,
          melhorOpcao,
          economiaMensal
        }
      });

      return res.status(201).json({
        message: "Cálculo simulado e salvo com sucesso!",
        calculo: novoCalculo
      });

    } catch (error) {
      console.error("Erro ao processar cálculo:", error);
      return res.status(500).json({ error: "Erro interno do servidor ao processar o cálculo tributário." });
    }
  },

  history: async (req, res) => {
    try {
      const userId = req.userId;

      const historico = await prisma.calculo.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });

      return res.status(200).json(historico);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
      return res.status(500).json({ error: "Erro interno ao buscar o histórico de cálculos." });
    }
  }
};

module.exports = calculoController;

const prisma = require('../config/prisma');
const { enviarEmail } = require('../config/mailer');

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_NAF = process.env.NAF_EMAIL || 'naf@localhost';

const brl = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const semQuebras = (texto) => texto.replace(/[\r\n]+/g, ' ').trim();

const NOMES_PROFISSAO = {
  psicologo: 'Psicólogo(a)',
  arquiteto: 'Arquiteto(a)',
  advogado: 'Advogado(a)',
  medico: 'Médico(a)',
  dentista: 'Dentista',
};

const emailController = {
  contato: async (req, res) => {
    try {
      const { nome, email, mensagem } = req.body;

      if (typeof nome !== 'string' || typeof email !== 'string' || typeof mensagem !== 'string'
        || !nome.trim() || !mensagem.trim()) {
        return res.status(400).json({ error: "Nome, e-mail e mensagem são obrigatórios." });
      }
      if (!EMAIL_VALIDO.test(email.trim())) {
        return res.status(400).json({ error: "Informe um e-mail válido." });
      }
      if (nome.length > 100 || mensagem.length > 2000) {
        return res.status(400).json({ error: "Nome ou mensagem acima do tamanho permitido." });
      }

      const resultado = await enviarEmail({
        to: EMAIL_NAF,
        replyTo: email.trim(),
        subject: `Contato pela Calculadora Tributária: ${semQuebras(nome)}`,
        text: `Nome: ${semQuebras(nome)}\nE-mail: ${email.trim()}\n\n${mensagem}`,
      });

      return res.status(200).json({ message: "Mensagem enviada ao NAF.", ...resultado });
    } catch (error) {
      console.error("Erro ao enviar mensagem ao NAF:", error);
      return res.status(500).json({ error: "Não foi possível enviar a mensagem." });
    }
  },

  resultado: async (req, res) => {
    try {
      const { email, calculoId } = req.body;

      if (typeof email !== 'string' || !EMAIL_VALIDO.test(email.trim()) || typeof calculoId !== 'string') {
        return res.status(400).json({ error: "Informe um e-mail válido e o cálculo a enviar." });
      }

      const calculo = await prisma.calculo.findFirst({ where: { id: calculoId, userId: req.userId } });
      if (!calculo) {
        return res.status(404).json({ error: "Cálculo não encontrado." });
      }

      const linhas = [
        'Resultado da simulação tributária (valores estimativos, base 2026)',
        '',
        `Profissão: ${NOMES_PROFISSAO[calculo.tipoProfissao] ?? calculo.tipoProfissao}`,
        `Renda mensal: ${brl(calculo.faturamento)}`,
        `Custos dedutíveis: ${brl(calculo.custos ?? 0)}`,
      ];
      if (calculo.anexo) {
        linhas.push(
          `Pró-labore/folha mensal: ${brl(calculo.proLabore)}`,
          `Fator R: ${(calculo.fatorR * 100).toFixed(2).replace('.', ',')}% (Anexo ${calculo.anexo})`,
        );
      }
      linhas.push(
        '',
        `Imposto como Pessoa Física: ${brl(calculo.impostoPF)}`,
        `Imposto como Pessoa Jurídica: ${brl(calculo.impostoPJ)}`,
        `Opção mais vantajosa: ${calculo.melhorOpcao}`,
        `Economia mensal: ${brl(calculo.economiaMensal)}`,
        '',
        'Esta simulação é uma estimativa e não substitui a orientação de um contador.',
        'NAF - Núcleo de Apoio Contábil e Fiscal - Unichristus',
      );

      const resultado = await enviarEmail({
        to: email.trim(),
        subject: 'Resultado da sua simulação tributária - NAF Unichristus',
        text: linhas.join('\n'),
      });

      return res.status(200).json({ message: "Resultado enviado por e-mail.", ...resultado });
    } catch (error) {
      console.error("Erro ao enviar resultado por e-mail:", error);
      return res.status(500).json({ error: "Não foi possível enviar o e-mail." });
    }
  },
};

module.exports = emailController;

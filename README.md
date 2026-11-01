# Calculadora Tributária NAF - Comparativo PF x PJ (2026.2)

Aplicação web full-stack desenvolvida para o **Núcleo de Apoio Contábil e Fiscal (NAF)** da Universidade Christus. Ela estima e compara a carga tributária mensal de profissionais autônomos como **Pessoa Física** (IRPF com Livro Caixa) e como **Pessoa Jurídica** (Simples Nacional e INSS sobre o pró-labore), indicando a opção mais vantajosa.

Esta versão (NP2, 2026.2) evolui a calculadora entregue em 2026.1, desenvolvida por Alisson Almeida de Oliveira, preservando as funcionalidades existentes. A documentação completa está no relatório técnico `docs/Especificacao_Tecnica_Calculadora_NAF.docx`.

## Funcionalidades

* Profissões: psicólogo, arquiteto, advogado, **médico e dentista (com Fator R)**.
* **Fator R** para médico e dentista: com o campo extra de pró-labore/folha, o sistema calcula o Fator R, aplica o Anexo III (28% ou mais) ou V e exibe o valor e o anexo no resultado.
* Navegação com React Router: `/` (formulário), `/comparativo` (resultado), `/historico`, `/faq` e `/sobre`, mais `/inicio`, `/login` e `/cadastro`. Menu em todas as páginas, página 404 personalizada e redirecionamento de `/comparativo` quando não há dados.
* **Relatório em PDF** com cabeçalho NAF/Unichristus, data e hora, gráfico PF x PJ, memória de cálculo (base e alíquota de cada tributo) e aviso de estimativas.
* Envio do resultado por e-mail, envio de mensagem ao NAF (página Sobre) e histórico de simulações por usuário.
* Opcionais: **tema claro/escuro** (preferência persistida), **exportação do histórico em CSV** e vídeos conforme o resultado do comparativo.
* Acessibilidade e responsividade: a partir de 320 px, rótulos em todos os campos, erros anunciados, foco visível, contraste AA e Lighthouse acima de 90.

## Estrutura

* `frontend/`: React 19, Vite, Tailwind CSS, React Router, Recharts e html2pdf.js.
* `backend/`: Node.js, Express, Prisma ORM, PostgreSQL, JWT e Nodemailer.
* `docker-compose.yaml`: front-end, API e banco de dados.
* `.github/workflows/ci.yml`: lint, build e verificação de sintaxe a cada push e pull request.
* `docs/`: relatório técnico.

## Como executar (Docker)

Pré-requisitos: Git e Docker com Docker Compose v2.

1. Clone o repositório e crie o arquivo de ambiente:
   ```bash
   git clone https://github.com/lucasmaiagcastro/calculadora-tributaria-naf.git
   cd calculadora-tributaria-naf
   cp .env.example .env
   ```
2. Edite o `.env` e preencha, no mínimo, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `DATABASE_URL` (com os mesmos valores) e `JWT_SECRET`.
3. Suba os serviços:
   ```bash
   docker compose up --build
   ```
4. Acesse:
   * Aplicação: http://localhost:5173
   * API: http://localhost:3000

As migrations do banco são aplicadas automaticamente. No primeiro acesso, crie um usuário em **Criar Conta**.

### E-mails

As variáveis `SMTP_*`, `MAIL_FROM` e `NAF_EMAIL` do `.env` configuram o envio real. Sem `SMTP_HOST`, nenhum e-mail sai: a API apenas registra o conteúdo no log (`docker compose logs backend`) e a interface informa essa condição.

### Dependências novas

Ao adicionar dependências, suba novamente com `docker compose up --build -V` para renovar os módulos dos contêineres.

## Qualidade

```bash
cd frontend && npm run lint && npm run build
```

Convenção de commits e pull requests: `[TIPO][MÓDULO] Verbo no infinitivo + descrição`, com uma branch por funcionalidade integrada à `main` por pull request.

Os detalhes de cada parte estão em `frontend/README.md` e `backend/README.md`.

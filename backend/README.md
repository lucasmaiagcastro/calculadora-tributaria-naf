# 💻 Calculadora Tributária NAF - Backend API

Esta pasta contém o servidor backend (API REST) da Calculadora Tributária, responsável pelas regras de negócio fiscais, autenticação de usuários e persistência de dados.

## 🛠️ Tecnologias e Dependências
* **Runtime & Framework:** Node.js com Express.
* **ORM & Banco de Dados:** Prisma ORM integrado ao PostgreSQL via Docker.
* **Segurança:** BCrypt (criptografia de senhas) e JSON Web Token (JWT para autenticação de sessões).
* **Desenvolvimento:** Nodemon com suporte a *Legacy Watch* para sincronização instantânea em containers.

## 🔑 Funcionalidades e Regras de Negócio Implementadas
* **Autenticação:** Cadastro de usuários com hash seguro (bcrypt) e geração de tokens JWT no login. O servidor não inicia sem a variável `JWT_SECRET`.
* **Motor Fiscal (`POST /calculos`):**
  * **Pessoa Física:** Cálculo progressivo do IRPF mensal sobre a renda menos os custos (Livro Caixa).
  * **Pessoa Jurídica:** Simples Nacional sobre o faturamento (psicólogo e arquiteto, Anexo III a 6%; advogado, Anexo IV a 4,5%) somado ao INSS de 11% sobre o pró-labore, com piso de um salário mínimo (R$ 1.621,00).
  * **Fator R (médico e dentista):** Fator R = pró-labore ÷ renda mensal. Com 28% ou mais, aplica-se o Anexo III (6%); abaixo, o Anexo V (15,5%). O pró-labore é obrigatório para essas profissões e o resultado devolve `fatorR` e `anexo`.
  * Validações: renda entre R$ 0,00 e R$ 15.000,00 e pró-labore entre zero e a renda.
* **Histórico (`GET /calculos/historico`):** Consulta das simulações do usuário autenticado, com Fator R e Anexo quando houver.
* **E-mails (`/send-email`):** `POST /send-email` (mensagem ao NAF, público) e `POST /send-email/resultado` (resultado de uma simulação, autenticado), com limite de requisições. Sem `SMTP_HOST`, o e-mail é apenas registrado no log.

## 🌐 Rotas da API
| Método e rota | Acesso | Descrição |
|---|---|---|
| `POST /auth/register`, `POST /auth/login` | Público | Cadastro e login (retorna o token JWT) |
| `GET /auth/me` | Autenticado | Dados do usuário |
| `POST /calculos` | Autenticado | Calcula, compara PF x PJ e salva a simulação |
| `GET /calculos/historico` | Autenticado | Lista as simulações do usuário |
| `POST /send-email` | Público | Mensagem ao NAF |
| `POST /send-email/resultado` | Autenticado | Envia o resultado de uma simulação por e-mail |

## 🚀 Execução Local (Desenvolvimento Isolado)
Se houver a necessidade de rodar o servidor Express isoladamente fora do Docker local:

### Passo a Passo
1. Certifique-se de estar na pasta correta:
```bash
cd backend
```
2. Instale as dependências locais:
  ```bash
  npm install
  ```
3. Configure as variáveis de ambiente criando um arquivo .env (modelo em `.env.example`) com a string de conexão de um PostgreSQL local e a chave do JWT:
  ```bash
  DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_banco?schema=public"
  JWT_SECRET="uma-chave-longa-e-aleatoria"
  ```
4. Execute as migrações do banco com o Prisma:
  ```bash
  npx prisma migrate dev
  ```
5. Inicie o servidor em modo de desenvolvimento:
  ```bash
  npm start
  ```

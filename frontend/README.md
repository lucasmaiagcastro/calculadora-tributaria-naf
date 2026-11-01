# 💻 Calculadora Tributária NAF - Frontend Application

Esta pasta contém a interface gráfica de usuário (Single Page Application) da Calculadora Tributária, projetada com foco em experiência do usuário (UX) e responsividade para os atendimentos do NAF.

## 🛠️ Tecnologias e Bibliotecas
* **Core:** ReactJS 19 (componentes funcionais e hooks) compilado via Vite.
* **Roteamento:** React Router Dom com layout compartilhado (menu e rodapé), rotas protegidas por token e página 404.
* **Estilização:** Tailwind CSS 4, com tema claro/escuro alternado por classe no `<html>`.
* **Gráfico:** Recharts (comparativo PF x PJ).
* **Comunicação:** Axios com *interceptor* que injeta o Bearer Token JWT nas requisições (`VITE_API_URL` define a URL da API).
* **Exportação:** html2pdf.js para o relatório em PDF e geração de CSV do histórico.

## 📄 Rotas e Telas
| Rota | Tela |
|---|---|
| `/` | Formulário da calculadora (profissão, renda, custos e, para médico e dentista, pró-labore do Fator R) |
| `/comparativo` | Resultado: cabeçalho, melhor opção, gráfico PF x PJ, memória de cálculo, PDF, e-mail e vídeo. Sem dados, redireciona para `/` |
| `/historico` | Simulações salvas do usuário, com Fator R/Anexo e exportação em CSV |
| `/faq`, `/sobre` | Dúvidas frequentes; explicação dos cálculos e contato com o NAF |
| `/inicio`, `/login`, `/cadastro`, `/recuperar-senha` | Páginas públicas |
| `*` | Página 404 personalizada |

## 🗂️ Organização do código (`src/`)
* `Pages/`: uma tela por rota (Formulario, Comparativo, Historico, Faq, Sobre, NotFound, Login, Cadastro, Landing, RecuperarSenha).
* `components/`: Layout, Navbar, Footer, RotaProtegida, ThemeToggle, GraficoComparativo e MemoriaCalculo.
* `services/api.js`: cliente axios; `utils/`: formatação de valores e geração de CSV.

## ♿ Acessibilidade e Responsividade
Uso a partir de 320 px sem rolagem horizontal, rótulos associados a todos os campos, erros anunciados com `role="alert"`, link para pular ao conteúdo, foco visível por teclado e contraste AA, nos dois temas. O Lighthouse (build de produção) registra 100 em Acessibilidade e Desempenho nas rotas medidas.

## 🚀 Execução Local (Desenvolvimento Isolado)
Se preferir rodar ou testar apenas a interface do React de forma isolada sem o Docker Compose da raiz:

### Passo a Passo
1. Garanta que está na pasta correta:
    ```bash
    cd frontend
    ```
2. Instale as dependências do ecossistema:
    ```bash
    npm install
    ```
3. Inicie o servidor do Vite em ambiente de desenvolvimento local:
    ```bash
    npm run dev
    ```
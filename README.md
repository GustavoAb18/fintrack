# FinTrack
Aplicativo mobile de finanças pessoais: registre receitas e despesas, **importe
lançamentos direto do seu banco via Open Finance** e acompanhe para onde o dinheiro
está indo.
## Funcionalidades
- Cadastro, login e sessão persistente (Supabase Auth)
- Lançamentos de receitas e despesas: criar, editar e excluir
- **Open Finance:** conecte seus bancos e importe extratos e faturas (somente leitura)
- Painel mensal com saldo, receitas, despesas e gráfico por categoria
- Lista agrupada por dia, com busca e filtro por tipo
- Exportação dos lançamentos em CSV
- Dados isolados por usuário com Row Level Security
## Tecnologias
React Native · Expo · Expo Router · TypeScript · Supabase (Auth, Postgres, RLS, Edge
Functions) · Pluggy (agregador Open Finance) · TanStack Query · React Hook Form · Zod ·
react-native-svg · Jest
## Capturas de tela
| Início | Lançamentos | Contas bancárias |
| ------ | ----------- | ---------------- |
| ![Início](docs/inicio.png) | ![Lista](docs/lancamentos.png) | ![Bancos](docs/bancos.png) |
## Como executar
1. Instale as dependências: `npm install`
2. Crie um projeto no [Supabase](https://supabase.com) e execute, nesta ordem,
`supabase/schema.sql` e `supabase/open-finance.sql` no SQL Editor.
3. Copie `.env.example` para `.env` e preencha a URL e a chave pública.
4. Open Finance (opcional): crie uma aplicação em
[dashboard.pluggy.ai](https://dashboard.pluggy.ai) e publique as funções:
```
npx supabase login
npx supabase link --project-ref SEU-PROJECT-REF
npx supabase secrets set PLUGGY_CLIENT_ID=... PLUGGY_CLIENT_SECRET=...
npx supabase functions deploy bank-connect-token
npx supabase functions deploy bank-sync
npx supabase functions deploy bank-disconnect
```
5. Inicie o app: `npx expo start` e abra no Expo Go.
## Como o Open Finance funciona aqui
```
app -> bank-connect-token -> Pluggy (token de 30 min)
app -> widget do Pluggy -> consentimento no banco
app -> bank-sync -> Pluggy -> regras puras -> tabela transactions
```
As credenciais do Pluggy ficam só no servidor. A função confere que a conexão pertence
ao usuário logado antes de importar.
## Scripts
| Comando | O que faz |
| ------------------- | ---------------------------- |
| `npm start` | Inicia o servidor do Expo |
| `npm test` | Executa os testes unitários |
| `npm run typecheck` | Verifica os tipos com o TSC |
| `npm run format` | Formata o código (Prettier) |
## Autor
Seu Nome · [LinkedIn](www.linkedin.com/in/gustavo-andrade-abdev) · [GitHub](https://github.com/gustavoab18)

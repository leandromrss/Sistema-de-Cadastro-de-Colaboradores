# GTSys - Sistema de Cadastro de Colaboradores

Sistema web para cadastro e gerenciamento de colaboradores de uma empresa.

## Funcionalidades

- Autenticação de usuários
- Cadastro de colaboradores com:
  - Nome completo
  - CPF (com validação para evitar duplicidade)
  - E-mail
  - Telefone
  - Área (seleção de área específica)
  - Cargo
- Listagem de todos os colaboradores
- Busca por colaboradores
- Edição de dados dos colaboradores
- Exclusão de colaboradores


## Tecnologias Utilizadas

- Node.js
- Express
- MySQL
- JWT para autenticação
- HTML/CSS/JavaScript (Frontend)

## Estrutura do Projeto

```
gtsys/
├── config/
│   └── database.js
├── controllers/
│   ├── authController.js
│   └── colaboradorController.js
├── data/
│   └── usuarios.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── colaboradorModel.js
│   └── usuarioModel.js
├── public/
│   ├── css/
│   │   ├── login.css
│   │   └── style.css
│   ├── js/
│   │   ├── login.js
│   │   └── script.js
│   ├── index.html
│   └── login.html
├── routes/
│   ├── authRoutes.js
│   └── colaboradorRoutes.js
├── .env
├── .gitignore
├── app.js
├── package.json
└── README.md
```

## Instalação e Execução

1. Clone o repositório:
   ```
   git clone <URL_DO_REPOSITÓRIO>
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Configure o arquivo `.env` com suas variáveis de ambiente:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=seu_usuario_mysql
   DB_PASSWORD=sua_senha_mysql
   DB_NAME=cadastro_colaboradores
   JWT_SECRET=sua_chave_secreta_para_tokens
   ```

4. Configure o banco de dados MySQL:
   - Crie um banco de dados chamado `cadastro_colaboradores`
   - Execute o script SQL fornecido para criar as tabelas necessárias

5. Inicie o servidor:
   ```
   npm start
   ```

6. Acesse a aplicação no navegador:
   ```
   http://localhost:3000
   ```

## Observações

É necessário login para acessar o sistema
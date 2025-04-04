# Sistema de Cadastro de Colaboradores

Sistema web para gerenciamento de colaboradores, desenvolvido com HTML, CSS e JavaScript.

## Funcionalidades

### Gerais
- Interface responsiva e moderna
- Barra lateral colapsável para navegação
- Sistema de autenticação com token
- Tema consistente com a identidade visual da empresa

### Colaboradores
- Listagem de colaboradores com tabela interativa
- Formulário de cadastro/edição colapsável
- Botões de ação para editar e excluir
- Filtros de busca
- Validação de campos obrigatórios

### Relatórios
- Exportação de relatórios em CSV
- Filtros avançados para exportação:
  - Nome
  - CPF
  - Setor
  - Cargo
  - Líder Direto

## Recursos de Interface

### Barra Lateral
- Toggle para minimizar/expandir
- Navegação entre seções
- Indicador visual da seção ativa
- Ícones e rótulos para melhor usabilidade

### Tabelas
- Cabeçalho com toggle para minimizar/expandir
- Ordenação por colunas
- Linhas com hover effect
- Botões de ação com ícones

### Formulários
- Layout em duas colunas para melhor organização
- Toggle para minimizar/expandir o formulário
- Animações suaves nas transições
- Validação em tempo real
- Botões de ação (Salvar/Cancelar) sempre visíveis

### Responsividade
- Adaptação para dispositivos móveis
- Reorganização de colunas em telas pequenas
- Menu lateral colapsado em dispositivos móveis
- Formulários em coluna única em telas pequenas

## Atualizações Recentes

### v1.1.0
- Adicionado toggle no formulário de cadastro
- Melhorias na animação de collapse/expand
- Ajuste no tamanho máximo do formulário para evitar corte dos botões
- Adicionado efeito hover no cabeçalho do formulário
- Melhorias na transição de altura e opacidade

## Guia de Estilos

### Cores
- Principal: #bcd43c (Verde institucional)
- Secundária: #f5f5f5 (Cinza claro)
- Texto: #000000 (Preto)
- Fundo: #ffffff (Branco)
- Botões de ação:
  - Editar: #f39c12 (Laranja)
  - Excluir: #e74c3c (Vermelho)
  - Visualizar: #3498db (Azul)

### Tipografia
- Fonte principal: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- Tamanhos:
  - Títulos: 1.25rem - 1.5rem
  - Texto: 14px - 16px
  - Ícones: 1.2rem

### Espaçamento
- Padding padrão: 20px
- Gap entre elementos: 10px - 15px
- Margens: 20px
- Altura do cabeçalho do formulário: 60px

### Animações
- Duração: 0.3s
- Timing: ease/ease-in-out
- Transições em:
  - Altura
  - Opacidade
  - Transformações
  - Cores de fundo

## Requisitos Técnicos
- Navegador moderno com suporte a ES6+
- Conexão com internet para carregar ícones (Font Awesome)
- Servidor web para hospedar a aplicação
- API REST para operações de CRUD

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
   PORT=3008
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
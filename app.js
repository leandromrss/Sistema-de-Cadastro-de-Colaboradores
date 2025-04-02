require('dotenv').config();
const express = require('express');
const path = require('path');
const colaboradorRoutes = require('./routes/colaboradorRoutes');
const authRoutes = require('./Routes/authRoutes'); // Importe as novas rotas

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API
app.use('/api/colaboradores/', colaboradorRoutes);
app.use('/api/auth', authRoutes); // Adicione as rotas de autenticação

// Rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para a página de login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Middleware para lidar com rotas não encontradas
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'Endpoint não encontrado' });
  }
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
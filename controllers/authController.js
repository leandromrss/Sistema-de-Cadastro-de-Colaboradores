const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Caminho para o arquivo JSON que armazenará os usuários
const usuariosDB = path.join(__dirname, '../data/usuarios.json'); // Corrigido o caminho!

// Função para ler usuários do arquivo
const getUsuarios = () => {
  try {
    if (!fs.existsSync(usuariosDB)) {
      fs.writeFileSync(usuariosDB, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(usuariosDB, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler usuários:', error);
    return [];
  }
};

// Função para salvar usuários no arquivo
const salvarUsuarios = (usuarios) => {
  try {
    fs.writeFileSync(usuariosDB, JSON.stringify(usuarios, null, 2));
  } catch (error) {
    console.error('Erro ao salvar usuários:', error);
  }
};

// Função de registro de usuário
const register = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    const usuarios = getUsuarios();

    if (usuarios.some(user => user.email === email)) {
      return res.status(400).json({ message: 'Este email já está cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    
    const novoUsuario = {
      id: Date.now().toString(),
      nome,
      email,
      senha: hashedPassword,
      createdAt: new Date().toISOString()
    };

    usuarios.push(novoUsuario);
    salvarUsuarios(usuarios);

    res.status(201).json({ message: 'Cadastro realizado com sucesso', id: novoUsuario.id });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Função de login de usuário
const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    const usuarios = getUsuarios();
    const usuario = usuarios.find(user => user.email === email);

    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      return res.status(401).json({ message: 'Email ou senha incorretos' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET || 'sua_chave_secreta_aqui',
      { expiresIn: '24h' }
    );

    res.json({ message: 'Login realizado com sucesso', token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Exportando as funções corretamente
module.exports = { register, login };
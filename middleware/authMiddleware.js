const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // Obter o token do header
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }
  
  // Formato do token: "Bearer {token}"
  const parts = authHeader.split(' ');
  
  if (parts.length !== 2) {
    return res.status(401).json({ message: 'Erro no formato do token' });
  }
  
  const [scheme, token] = parts;
  
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: 'Formato de token inválido' });
  }
  
  // Verificar o token
  jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    
    // Salvar as informações do usuário para uso nas rotas
    req.userId = decoded.id;
    req.userName = decoded.nome;
    
    return next();
  });
}

module.exports = authMiddleware;
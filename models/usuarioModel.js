const db = require('../config/database');
const bcrypt = require('bcrypt');

class UsuarioModel {
  static async create(usuario) {
    try {
      // Hash da senha
      const salt = await bcrypt.genSalt(10);
      const senhaHash = await bcrypt.hash(usuario.senha, salt);
      
      const [result] = await db.query(
        'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
        [usuario.nome, usuario.email, senhaHash]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async verifyPassword(senha, senhaHash) {
    return await bcrypt.compare(senha, senhaHash);
  }
}

module.exports = UsuarioModel;
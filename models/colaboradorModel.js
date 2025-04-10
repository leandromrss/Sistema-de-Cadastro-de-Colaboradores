const db = require('../config/database');

class ColaboradorModel {
  static async getAll() {
    try {
      const [rows] = await db.query('SELECT * FROM colaboradores ORDER BY nome');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM colaboradores WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getByCPF(cpf) {
    try {
      const [rows] = await db.query('SELECT * FROM colaboradores WHERE cpf = ?', [cpf]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  static async create(colaborador) {
    try {
      // Verifica se o CPF já existe antes de inserir
      const existente = await this.getByCPF(colaborador.cpf);
      if (existente) {
        throw new Error('Já existe um colaborador com este CPF.');
      }

      const [result] = await db.query(
        'INSERT INTO colaboradores (nome, cpf, data_nascimento, setor, cargo, lider_direto, telefone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          colaborador.nome,
          colaborador.cpf,
          colaborador.data_nascimento,
          colaborador.setor,
          colaborador.cargo,
          colaborador.lider_direto,
          colaborador.telefone,
          colaborador.email
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, colaborador) {
    try {
      await db.query(
        'UPDATE colaboradores SET nome = ?, cpf = ?, data_nascimento = ?, setor = ?, cargo = ?, lider_direto = ?, telefone = ?, email = ? WHERE id = ?',
        [
          colaborador.nome,
          colaborador.cpf,
          colaborador.data_nascimento,
          colaborador.setor,
          colaborador.cargo,
          colaborador.lider_direto,
          colaborador.telefone,
          colaborador.email,
          id
        ]
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      await db.query('DELETE FROM colaboradores WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async search(term) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM colaboradores WHERE nome LIKE ? OR cpf LIKE ? OR setor LIKE ? OR cargo LIKE ? OR lider_direto LIKE ? OR email LIKE ?',
        [`%${term}%`, `%${term}%`, `%${term}%`, `%${term}%`, `%${term}%`, `%${term}%`]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
  static async searchWithFilters(filtros) {
    try {
        let query = 'SELECT * FROM colaboradores';
        let params = [];
        let conditions = [];

        if (filtros.nome) {
            conditions.push('nome LIKE ?');
            params.push(`%${filtros.nome}%`);
        }
        if (filtros.cpf) {
            conditions.push('cpf LIKE ?');
            params.push(`%${filtros.cpf}%`);
        }
        if (filtros.setor) {
            conditions.push('setor LIKE ?');
            params.push(`%${filtros.setor}%`);
        }
        if (filtros.cargo) {
            conditions.push('cargo LIKE ?');
            params.push(`%${filtros.cargo}%`);
        }
        if (filtros.lider_direto) {
            conditions.push('lider_direto LIKE ?');
            params.push(`%${filtros.lider_direto}%`);
        }
        if (filtros.dataInicio && filtros.dataFim) {
            conditions.push('data_nascimento BETWEEN ? AND ?');
            params.push(filtros.dataInicio, filtros.dataFim);
        }

        // Se houver filtros, adiciona WHERE
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY nome'; // Ordena pelo nome para melhorar visualização

        const [rows] = await db.query(query, params);
        return rows;
    } catch (error) {
        throw error;
    }
}
}
module.exports = ColaboradorModel;
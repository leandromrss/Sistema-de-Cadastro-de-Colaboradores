const ColaboradorModel = require('../models/colaboradorModel');

class ColaboradorController {
  static async getAll(req, res) {
    try {
      const colaboradores = await ColaboradorModel.getAll();
      res.json(colaboradores);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar colaboradores', error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const id = req.params.id;
      const colaborador = await ColaboradorModel.getById(id);
      
      if (!colaborador) {
        return res.status(404).json({ message: 'Colaborador não encontrado' });
      }
      
      res.json(colaborador);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar colaborador', error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const colaborador = req.body;
      const id = await ColaboradorModel.create(colaborador);
      res.status(201).json({ id, message: 'Colaborador cadastrado com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao cadastrar colaborador', error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const id = req.params.id;
      const colaborador = req.body;
      
      await ColaboradorModel.update(id, colaborador);
      res.json({ message: 'Colaborador atualizado com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar colaborador', error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const id = req.params.id;
      await ColaboradorModel.delete(id);
      res.json({ message: 'Colaborador excluído com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir colaborador', error: error.message });
    }
  }

  static async search(req, res) {
    try {
      const term = req.query.term;
      if (!term) {
        return res.status(400).json({ message: 'Termo de busca não fornecido' });
      }
      
      const colaboradores = await ColaboradorModel.search(term);
      res.json(colaboradores);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao pesquisar colaboradores', error: error.message });
    }
  }
}

module.exports = ColaboradorController;
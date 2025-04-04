const { Parser } = require('json2csv');
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

      // Verifica se já existe um colaborador com o mesmo CPF
      const colaboradorExistente = await ColaboradorModel.getByCPF(colaborador.cpf);
      if (colaboradorExistente) {
        return res.status(400).json({ message: 'Já existe um colaborador com este CPF' });
      }

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
  static async exportCSV(req, res) {
    console.log("Função exportCSV foi chamada com query:", req.query);
    try {
        const filtros = {
            nome: req.query.nome || '',
            cpf: req.query.cpf || '',
            setor: req.query.setor || '',
            cargo: req.query.cargo || '',
            lider_direto: req.query.lider_direto || '',
            dataInicio: req.query.dataInicio || '',
            dataFim: req.query.dataFim || ''
        };

        console.log("Filtros processados:", filtros);

        // Verificar se há algum filtro aplicado
        const temFiltros = Object.values(filtros).some(val => val !== '');
        
        let colaboradores;
        if (temFiltros) {
            // Com filtros, usa a função de busca com filtros
            colaboradores = await ColaboradorModel.searchWithFilters(filtros);
        } else {
            // Sem filtros, busca todos
            colaboradores = await ColaboradorModel.getAll();
        }

        console.log(`Encontrados ${colaboradores?.length || 0} colaboradores`);

        // Se não encontrou nada, retorna uma mensagem amigável
        if (!colaboradores || colaboradores.length === 0) {
            return res.status(404).json({ 
                message: 'Nenhum colaborador encontrado com os filtros aplicados.' 
            });
        }

        // Formatar datas para DD/MM/YYYY
        colaboradores = colaboradores.map(col => {
            const colab = {...col}; // Cria uma cópia para não modificar o original
            
            if (colab.data_nascimento) {
                const date = new Date(colab.data_nascimento);
                if (!isNaN(date.getTime())) {
                    const day = String(date.getUTCDate()).padStart(2, '0');
                    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
                    const year = date.getUTCFullYear();
                    colab.data_nascimento = `${day}/${month}/${year}`;
                }
            }
            
            return colab;
        });

        // Configuração e geração do CSV
        try {
            const fields = ['id', 'nome', 'cpf', 'data_nascimento', 'setor', 'cargo', 
                           'lider_direto', 'telefone', 'email'];
            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(colaboradores);
            
            console.log("CSV gerado com sucesso");
            
            // Enviar como arquivo
            res.header('Content-Type', 'text/csv');
            res.attachment('relatorio_colaboradores.csv');
            res.send(csv);
        } catch (csvError) {
            console.error("Erro ao gerar CSV:", csvError);
            res.status(500).json({ 
                message: 'Erro ao gerar o arquivo CSV', 
                error: csvError.message 
            });
        }
    } catch (error) {
        console.error('Erro completo:', error);
        res.status(500).json({ 
            message: 'Erro ao processar a exportação', 
            error: error.message 
        });
    }
}
}


module.exports = ColaboradorController;
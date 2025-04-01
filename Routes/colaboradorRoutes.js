const express = require('express');
const router = express.Router();
const ColaboradorController = require('../controllers/colaboradorController');

// Rotas para colaboradores
router.get('/', ColaboradorController.getAll);
router.get('/search', ColaboradorController.search);
router.get('/:id', ColaboradorController.getById);
router.post('/', ColaboradorController.create);
router.put('/:id', ColaboradorController.update);
router.delete('/:id', ColaboradorController.delete);

module.exports = router;
const express = require('express');
const router = express.Router();
const ColaboradorController = require('../controllers/colaboradorController');

// Rotas para colaboradores
router.get('/export', ColaboradorController.exportCSV);
router.get('/search', ColaboradorController.search);
router.get('/', ColaboradorController.getAll);
router.post('/', ColaboradorController.create);
router.get('/:id', ColaboradorController.getById);
router.put('/:id', ColaboradorController.update);
router.delete('/:id', ColaboradorController.delete);

module.exports = router;
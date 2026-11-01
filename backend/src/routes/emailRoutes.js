const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const authMiddleware = require('../middlewares/authMiddleware');
const rateLimit = require('../middlewares/rateLimit');

const novoLimite = () => rateLimit({ janelaMs: 10 * 60 * 1000, maximo: 10 });

// Contato com o NAF é público (página Sobre)
router.post('/', novoLimite(), emailController.contato);

router.post('/resultado', authMiddleware, novoLimite(), emailController.resultado);

module.exports = router;

const express = require('express');
const router = express.Router();

// Controllers
const {
  getFlujoMensualController,
  getFlujoProyectadoController,
  getFlujoAnualController,
} = require('../controllers/flujo_contable.controller');

// Middleware
const authMiddleware = require('../../../middlewares/auth.middleware',);
router.use(authMiddleware);

// Routes
router.get("/mensual/:idPeriodo", getFlujoMensualController);
router.get("/proyectado/:idPeriodo", getFlujoProyectadoController);
router.get("/anual", getFlujoAnualController);

module.exports = router;
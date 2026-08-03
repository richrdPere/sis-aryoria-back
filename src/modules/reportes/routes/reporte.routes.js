const express = require('express');
const router = express.Router();

// Controllers
const {
    getEvolucionPeriodoController,
    getReporteCategoriasController,
    getReporteGeneralController,
    getResumenPeriodoController,
} = require('../controller/reporte.controller');

// Middleware
const authMiddleware = require('../../../middlewares/auth.middleware',);

// Routes
router.get('/general', authMiddleware, getReporteGeneralController);
router.get('/evolucion-periodo', authMiddleware, getEvolucionPeriodoController);
router.get('/categorias', authMiddleware, getReporteCategoriasController);
router.get('/resumen-periodo', authMiddleware, getResumenPeriodoController);

module.exports = router;

// TODO: Add more report routes as needed
// GET /api/reportes/resumen-general
// GET /api/reportes/resumen-subcategorias
// GET /api/reportes/flujo-caja
// GET /api/reportes/flujo-anual
// GET /api/reportes/comparacion-mensual
// GET /api/reportes/estado-movimientos
// GET /api/reportes/cuentas
// GET /api/reportes/presupuestos
const express = require('express');
const router = express.Router();

// Controllers
const {
    getEvolucionPeriodoController,
    getReporteCategoriasController,
    getReporteGeneralController,
    getResumenAnualController,
    getResumenPeriodoController,
} = require('../controller/reporte.controller');

// Middleware
const authMiddleware = require('../../../middlewares/auth.middleware',);
router.use(authMiddleware);

// Routes
router.get('/general', getReporteGeneralController);
router.get('/evolucion-periodo', getEvolucionPeriodoController);
router.get('/categorias', getReporteCategoriasController);
router.get('/resumen-periodo', getResumenPeriodoController);
router.get('/resumen-anual', getResumenAnualController);

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
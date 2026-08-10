const express = require("express");
const router = express.Router();

// Middleware
const authMiddleware = require("../../../middlewares/auth.middleware");
router.use(authMiddleware);

// Controllers
const {
    deleteMovimientoController,
    getMovimientoByIdController,
    getMovimientosPaginadoController,
    registerMovimientoController,
    updateMovimientoController,
} = require("../controllers/movimiento.controller");

// ROUTES
router.post("/crear", registerMovimientoController);
router.get("/paginated", getMovimientosPaginadoController);
router.get("/detalle/:id", getMovimientoByIdController);
router.put("/editar/:id", updateMovimientoController);
router.delete("/eliminar/:id", deleteMovimientoController);

module.exports = router;
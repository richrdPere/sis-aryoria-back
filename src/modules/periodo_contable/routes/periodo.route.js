const express = require("express");
const router = express.Router();

// Middleware
const authMiddleware = require("../../../middlewares/auth.middleware");
router.use(authMiddleware);

// Controllers
const {
    changeEstadoPeriodoContableController,
    createPeriodoContableController,
    deletePeriodoContableController,
    getPeriodoCByIdController,
    getPeriodosCPaginadoController,
    updatePeriodoContableController,
} = require("../controllers/periodo.controller");

// ROUTES
router.post("/crear", createPeriodoContableController);
router.get("/paginated", getPeriodosCPaginadoController);
router.get("/detalle/:id", getPeriodoCByIdController);
router.put("/editar/:id", updatePeriodoContableController);
router.delete("/eliminar/:id", createPeriodoContableController);
router.patch("/estado/:id", changeEstadoPeriodoContableController);

module.exports = router;
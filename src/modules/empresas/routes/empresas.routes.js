const express = require("express");
const router = express.Router();

// Middleware
const authMiddleware = require("../../../middlewares/auth.middleware");
router.use(authMiddleware);

// Controllers
const {
    deleteEmpresaController,
    getEmpresaByIdController,
    getEmpresasPaginatedController,
    newEmpresaController,
    selectEmpresaController,
    updateEmpresaController,
} = require("../controllers/empresa.controller");

// ROUTES
router.post("/crear", newEmpresaController);
router.get("/paginated", getEmpresasPaginatedController);
router.put("/editar/:id", updateEmpresaController);
router.delete("/eliminar/:id", deleteEmpresaController);
router.get("/detalle/:id", getEmpresaByIdController);
router.post("/seleccionar", selectEmpresaController)

module.exports = router;
const express = require("express");
const router = express.Router();

// Controllers
const {
    changeSubcategoriaEstadoController,
    createSubcategoriaController,
    deleteSubcategoriaController,
    getSubcategoriaByIdController,
    getSubcategoriasByCategoriaController,
    getSubcategoriasController,
    updateSubcategoriaController,
} = require("../controllers/subcategoria.controller");

// Middleware
const authMiddleware = require("../../../middlewares/auth.middleware");

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// ROUTES
router.get("/paginado", getSubcategoriasController);
router.get("/categoria/:idCategoria", getSubcategoriasByCategoriaController);
router.get("/view/:id", getSubcategoriaByIdController);
router.post("/create", createSubcategoriaController);
router.put("/update/:id", updateSubcategoriaController);
router.patch("/estado/:id/estado", changeSubcategoriaEstadoController);
router.delete("/delete/:id", deleteSubcategoriaController);

module.exports = router;
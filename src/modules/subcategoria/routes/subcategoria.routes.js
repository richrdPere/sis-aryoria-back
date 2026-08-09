const express = require("express");
const router = express.Router();

// Controllers
const {
    changeSubcategoriaEstadoController,
    createSubcategoriaController,
    deleteSubcategoriaController,
    getSubcategoriaByIdController,
    getSubcategoriasByCategoriaController,
    getSubcategoriasByTipoController,
    getSubcategoriasController,
    updateSubcategoriaController,
} = require("../controllers/subcategoria.controller");

// Middleware
const authMiddleware = require("../../../middlewares/auth.middleware");
router.use(authMiddleware);

// ROUTES
router.get("/paginado", getSubcategoriasController);
router.get("/categoria/:idCategoria", getSubcategoriasByCategoriaController);
router.get("/view/:id", getSubcategoriaByIdController);
router.get("/tipo/:tipo", getSubcategoriasByTipoController);
router.post("/create", createSubcategoriaController);
router.put("/update/:id", updateSubcategoriaController);
router.patch("/estado/:id", changeSubcategoriaEstadoController);
router.delete("/delete/:id", deleteSubcategoriaController);

module.exports = router;
const express = require("express");
const router = express.Router();


// Middleware
const authMiddleware = require("../../../middlewares/auth.middleware");
router.use(authMiddleware);

// Controllers
const {
    createCategoriaController,
    deleteCategoriaController,
    getCategoriaByIdController,
    getCategoriaByTipoController,
    getCategoriasPaginadoController,
    updateCategoriaController,

} = require("../controllers/categoria.controller");

// ROUTES
router.post("/crear", createCategoriaController);
router.get("/paginated", getCategoriasPaginadoController);
router.get("/detalle/:id", getCategoriaByIdController);
router.get("/tipo/:tipo", getCategoriaByTipoController);
router.put("/editar/:id", updateCategoriaController);
router.delete("/eliminar/:id", deleteCategoriaController);

module.exports = router;
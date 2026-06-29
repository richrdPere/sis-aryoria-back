const express = require("express");
const router = express.Router();

const { createCategoria, getCategoriasPaginado, getCategoriaById, getCategoriaByTipo, updateCategoria, deleteCategoria } = require("../controllers/categoria.controller");

router.post("/crear", createCategoria);
router.get("/paginated", getCategoriasPaginado);
router.get("/detalle/:id", getCategoriaById);
router.get("/tipo/:tipo", getCategoriaByTipo);
router.put("/editar/:id", updateCategoria);
router.delete("/eliminar/:id", deleteCategoria);

module.exports = router;
const express = require("express");
const router = express.Router();

const { newEmpresa, getEmpresasPaginated, updateEmpresa, deleteEmpresa, getEmpresaById, selectEmpresa } = require("../controllers/empresa.controller");

// Middleware
const verificarToken = require("../../../middlewares/auth.middleware");

router.post("/crear", verificarToken, newEmpresa);
router.get("/paginated", verificarToken, getEmpresasPaginated);
router.put("/editar/:id", verificarToken, updateEmpresa);
router.delete("/eliminar/:id", verificarToken, deleteEmpresa);
router.get("/detalle/:id", verificarToken, getEmpresaById);
router.post("/seleccionar", verificarToken, selectEmpresa)

module.exports = router;
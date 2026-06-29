const express = require("express");
const router = express.Router();

const { newEmpresa, getEmpresasPaginated, updateEmpresa, deleteEmpresa, getEmpresaById } = require("../controllers/empresa.controller");


router.post("/crear", newEmpresa);
router.get("/paginated", getEmpresasPaginated);
router.put("/editar/:id", updateEmpresa);
router.delete("/eliminar/:id", deleteEmpresa);
router.get("/detalle/:id", getEmpresaById);

module.exports = router;
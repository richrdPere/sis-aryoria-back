const express = require("express");
const router = express.Router();
const {

    crearEmpresa,
    obtenerEmpresas,
    obtenerEmpresaById,
    actualizarEmpresa,
    eliminarEmpresa,
} = require("../controllers/empresas.controller");

// Crear empresa
router.post("/", crearEmpresa);

// Obtener todas
router.get("/", obtenerEmpresas);

// Obtener por ID
router.get("/:id", obtenerEmpresaById);

// Actualizar
router.put("/:id", actualizarEmpresa);

// Eliminar
router.delete("/:id", eliminarEmpresa);

module.exports = router;
const express = require("express");
const router = express.Router();
const { createIngreso, getIngresos, getIngresoById, updateIngreso, deleteIngreso } = require("../controllers/ingresos.controller");

// Crear ingreso
router.post("/", createIngreso);

// Obtener todos
router.get("/", getIngresos);

// Obtener por ID
router.get("/:id", getIngresoById);

// Actualizar
router.put("/:id", updateIngreso);

// Eliminar
router.delete("/:id", deleteIngreso);

module.exports = router;
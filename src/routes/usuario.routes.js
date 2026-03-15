const express = require("express");
const router = express.Router();

const {
  createUsuario,
  getUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
} = require("../controllers/usuario.controller");

// Crear usuario
router.post("/", createUsuario);

// Obtener todos
router.get("/", getUsuarios);

// Obtener por ID
router.get("/:id", getUsuarioById);

// Actualizar
router.put("/:id", updateUsuario);

// Eliminar
router.delete("/:id", deleteUsuario);

module.exports = router;
const express = require("express");
const router = express.Router();

const {
  createVenta,
  getVentas,
  getVentaById,
  updateVenta,
  deleteVenta,
} = require("../controllers/ventas.controller");

// Crear venta
router.post("/", createVenta);

// Obtener todas
router.get("/", getVentas);

// Obtener por ID
router.get("/:id", getVentaById);

// Actualizar
router.put("/:id", updateVenta);

// Eliminar
router.delete("/:id", deleteVenta);

module.exports = router;
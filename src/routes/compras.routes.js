const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

const {
  crearCompra,
  obtenerCompras,
  obtenerCompraPorId,
  actualizarCompra,
  eliminarCompra,
} = require("../controllers/compras.controller");

// 🔐 todas protegidas
router.use(authMiddleware);

router.post("/", crearCompra);
router.get("/", obtenerCompras);
router.get("/:id", obtenerCompraPorId);
router.put("/:id", actualizarCompra);
router.delete("/:id", eliminarCompra);

module.exports = router;
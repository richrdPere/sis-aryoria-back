const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

const {
  crearEgreso,
  obtenerEgresos,
  obtenerEgresoPorId,
  actualizarEgreso,
  eliminarEgreso,
} = require("../controllers/egresos.controller");

// 🔐 Todas protegidas
router.use(authMiddleware);

router.post("/", crearEgreso);
router.get("/", obtenerEgresos);
router.get("/:id", obtenerEgresoPorId);
router.put("/:id", actualizarEgreso);
router.delete("/:id", eliminarEgreso);

module.exports = router;
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

const {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoriaPorId,
  actualizarCategoria,
  eliminarCategoria,
} = require("../controllers/categoria.controller");

router.use(authMiddleware);

router.post("/", crearCategoria);
router.get("/", obtenerCategorias);
router.get("/:id", obtenerCategoriaPorId);
router.put("/:id", actualizarCategoria);
router.delete("/:id", eliminarCategoria);

module.exports = router;
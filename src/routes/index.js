const express = require("express");
const router = express.Router();

const authRoutes = require("../modules/auth/routes/auth.routes");
const roleRoutes = require("../modules/auth/routes/role.routes");
const empresaRoutes = require("../modules/empresas/routes/empresas.routes");
const categoriaRoutes = require("../modules/categorias/routes/categoria.route");
const periodoCRoutes = require("../modules/periodo_contable/routes/periodo.route");
const movimientoRoutes = require("../modules/movimientos/routes/movimiento.route");
const reporteRoutes = require("../modules/reportes/routes/reporte.routes");
const subcategoriaRoutes = require("../modules/subcategoria/routes/subcategoria.routes");




//  rutas
router.use("/auth", authRoutes);
router.use("/role", roleRoutes);
router.use("/empresas", empresaRoutes);
router.use("/categorias", categoriaRoutes);
router.use("/periodo-contable", periodoCRoutes);
router.use("/movimientos", movimientoRoutes);
router.use("/reportes", reporteRoutes);
router.use("/subcategorias", subcategoriaRoutes);

module.exports = router;
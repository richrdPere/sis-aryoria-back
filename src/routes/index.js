const express = require("express");

const authRoutes = require("./auth.routes");
const categoriasRoutes = require("./categoria.routes");
const comprasRoutes = require("./compras.routes");
const egresosRoutes = require("./egresos.routes");
const empresasRoutes = require("./empresas.routes");
const ingresosRoutes = require("./ingresos.routes");
const planRoutes = require("./plan.routes");
const ventasRoutes = require("./ventas.routes");
const usuariosRoutes = require("./usuario.routes");

const router = express.Router();

//  rutas
router.use("/auth", authRoutes);
router.use("/categorias", categoriasRoutes);
router.use("/compras", comprasRoutes);
router.use("/egresos", egresosRoutes);
router.use("/empresas", empresasRoutes);
router.use("/ingresos", ingresosRoutes);
router.use("/plan", planRoutes);
router.use("/ventas", ventasRoutes);
router.use("/usuarios", usuariosRoutes);

module.exports = router;
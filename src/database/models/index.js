const sequelize = require("../../config/database");

const db = {};

// CONEXIÓN
db.sequelize = sequelize;

// MODELOS

// - Auth
db.Usuario = require("./auth/usuario.model");
db.Roles = require("./auth/roles.model");
db.UsuarioRol = require("./auth/usuario_rol.model");
db.Persona = require("./personas/persona.model");

// - Empresas
db.Empresa = require("./empresas/empresa.model");

// - Finanzas
db.PeriodoContable = require("./finanzas/periodo_contable.model");
db.Presupuesto = require("./finanzas/presupuesto.model");
db.Transferencia = require("./finanzas/transferencia.model");
db.CierrePeriodo = require("./finanzas/cierre_periodo.model");

// - Movimientos
db.Categoria = require("./movimientos/categorias.model");
db.Subcategoria = require("./movimientos/subcategoria.model");
db.Movimiento = require("./movimientos/movimiento.model");
db.CuentaFinanciera = require("./movimientos/cuenta_financiera.model");

// CARGAR ASOCIACIONES
require("../associations")(db);


// EXPORT
module.exports = db;

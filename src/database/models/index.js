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
db.Categoria = require("./finanzas/categorias.model");
db.PeriodoContable = require("./finanzas/periodo_contable.model");
db.Movimiento = require("./finanzas/movimiento.model");


// CARGAR ASOCIACIONES
require("../associations")(db);


// EXPORT
module.exports = db;

// db.Rol = require("./auth/rol.model");
// db.UsuarioRol = require("./auth/usuario_rol.model");
// db.Empresa = require("./empresas/empresa.model");
// db.Cliente = require("./clientes/cliente.model");



// // Importar modelos
// const Usuario = require("./usuarios.model");
// const Persona = require("./persona.model");

// const Plan = require("./planes.model");
// const Empresa = require("./empresas.model");
// const Categoria = require("./categorias.model");
// const Venta = require("./ventas.model");
// const Compra = require("./compras.model");
// const Ingreso = require("./ingresos.model");
// const Egreso = require("./egresos.model");

// // Objeto db para centralizar todos los modelos y la instancia de Sequelize
// const db = {};

// // Aquí luego importaremos los modelos, por ejemplo:
// db.sequelize = sequelize;

// // Asignamos modelos al objeto db
// db.Usuario = Usuario;
// db.Persona = Persona;

// db.Plan = Plan;
// db.Empresa = Empresa;
// db.Categoria = Categoria;
// db.Venta = Venta;
// db.Compra = Compra;
// db.Ingreso = Ingreso;
// db.Egreso = Egreso;

// // =============================
// // RELACIONES
// // =============================

// // USUARIO - PERSONA
// db.Persona.hasOne(db.Usuario, { foreignKey: "id_persona", as: "usuario" });
// db.Usuario.belongsTo(db.Persona, { foreignKey: "id_persona", as: "persona" });


// //  PLAN - EMPRESA
// db.Plan.hasMany(db.Empresa, {
//   foreignKey: "id_plan",
//   as: "empresas",
// });

// db.Empresa.belongsTo(db.Plan, {
//   foreignKey: "id_plan",
//   as: "plan",
// });


// //  EMPRESA - USUARIOS
// Empresa.hasMany(Usuario, {
//   foreignKey: "id_empresa",
//   as: "usuarios",
// });

// Usuario.belongsTo(Empresa, {
//   foreignKey: "id_empresa",
//   as: "empresa",
// });


// //  EMPRESA - CATEGORIAS
// Empresa.hasMany(Categoria, {
//   foreignKey: "id_empresa",
//   as: "categorias",
// });

// Categoria.belongsTo(Empresa, {
//   foreignKey: "id_empresa",
//   as: "empresa",
// });


// //  EMPRESA - VENTAS
// Empresa.hasMany(Venta, {
//   foreignKey: "id_empresa",
//   as: "ventas",
// });

// Venta.belongsTo(Empresa, {
//   foreignKey: "id_empresa",
//   as: "empresa",
// });


// //  EMPRESA - COMPRAS
// Empresa.hasMany(Compra, {
//   foreignKey: "id_empresa",
//   as: "compras",
// });

// Compra.belongsTo(Empresa, {
//   foreignKey: "id_empresa",
//   as: "empresa",
// });


// //  EMPRESA - INGRESOS
// Empresa.hasMany(Ingreso, {
//   foreignKey: "id_empresa",
//   as: "ingresos",
// });

// Ingreso.belongsTo(Empresa, {
//   foreignKey: "id_empresa",
//   as: "empresa",
// });


// //  EMPRESA - EGRESOS
// Empresa.hasMany(Egreso, {
//   foreignKey: "id_empresa",
//   as: "egresos",
// });

// Egreso.belongsTo(Empresa, {
//   foreignKey: "id_empresa",
//   as: "empresa",
// });


// //  CATEGORIA - MOVIMIENTOS
// Categoria.hasMany(Venta, {
//   foreignKey: "id_categoria",
//   as: "ventas",
// });

// Venta.belongsTo(Categoria, {
//   foreignKey: "id_categoria",
//   as: "categoria",
// });

// Categoria.hasMany(Compra, {
//   foreignKey: "id_categoria",
//   as: "compras",
// });

// Compra.belongsTo(Categoria, {
//   foreignKey: "id_categoria",
//   as: "categoria",
// });

// Categoria.hasMany(Ingreso, {
//   foreignKey: "id_categoria",
//   as: "ingresos",
// });

// Ingreso.belongsTo(Categoria, {
//   foreignKey: "id_categoria",
//   as: "categoria",
// });

// Categoria.hasMany(Egreso, {
//   foreignKey: "id_categoria",
//   as: "egresos",
// });

// Egreso.belongsTo(Categoria, {
//   foreignKey: "id_categoria",
//   as: "categoria",
// });


// // =============================
// // EXPORTAR TODO
// // =============================
// module.exports = db;

// // module.exports = {
// //   sequelize,
// //   Plan,
// //   Empresa,
// //   Usuario,
// //   Categoria,
// //   Venta,
// //   Compra,
// //   Ingreso,
// //   Egreso,
// // };
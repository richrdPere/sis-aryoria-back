const sequelize = require("../config/database");

// Importar modelos
const Plan = require("./planes.model");
const Empresa = require("./empresas.model");
const Usuario = require("./usuarios.model");
const Categoria = require("./categorias.model");
const Venta = require("./ventas.model");
const Compra = require("./compras.model");
const Ingreso = require("./ingresos.model");
const Egreso = require("./egresos.model");


// =============================
// RELACIONES
// =============================

//  PLAN - EMPRESA
Plan.hasMany(Empresa, {
  foreignKey: "id_plan",
  as: "empresas",
});

Empresa.belongsTo(Plan, {
  foreignKey: "id_plan",
  as: "plan",
});


//  EMPRESA - USUARIOS
Empresa.hasMany(Usuario, {
  foreignKey: "id_empresa",
  as: "usuarios",
});

Usuario.belongsTo(Empresa, {
  foreignKey: "id_empresa",
  as: "empresa",
});


//  EMPRESA - CATEGORIAS
Empresa.hasMany(Categoria, {
  foreignKey: "id_empresa",
  as: "categorias",
});

Categoria.belongsTo(Empresa, {
  foreignKey: "id_empresa",
  as: "empresa",
});


//  EMPRESA - VENTAS
Empresa.hasMany(Venta, {
  foreignKey: "id_empresa",
  as: "ventas",
});

Venta.belongsTo(Empresa, {
  foreignKey: "id_empresa",
  as: "empresa",
});


//  EMPRESA - COMPRAS
Empresa.hasMany(Compra, {
  foreignKey: "id_empresa",
  as: "compras",
});

Compra.belongsTo(Empresa, {
  foreignKey: "id_empresa",
  as: "empresa",
});


//  EMPRESA - INGRESOS
Empresa.hasMany(Ingreso, {
  foreignKey: "id_empresa",
  as: "ingresos",
});

Ingreso.belongsTo(Empresa, {
  foreignKey: "id_empresa",
  as: "empresa",
});


//  EMPRESA - EGRESOS
Empresa.hasMany(Egreso, {
  foreignKey: "id_empresa",
  as: "egresos",
});

Egreso.belongsTo(Empresa, {
  foreignKey: "id_empresa",
  as: "empresa",
});


//  CATEGORIA - MOVIMIENTOS
Categoria.hasMany(Venta, {
  foreignKey: "id_categoria",
  as: "ventas",
});

Venta.belongsTo(Categoria, {
  foreignKey: "id_categoria",
  as: "categoria",
});

Categoria.hasMany(Compra, {
  foreignKey: "id_categoria",
  as: "compras",
});

Compra.belongsTo(Categoria, {
  foreignKey: "id_categoria",
  as: "categoria",
});

Categoria.hasMany(Ingreso, {
  foreignKey: "id_categoria",
  as: "ingresos",
});

Ingreso.belongsTo(Categoria, {
  foreignKey: "id_categoria",
  as: "categoria",
});

Categoria.hasMany(Egreso, {
  foreignKey: "id_categoria",
  as: "egresos",
});

Egreso.belongsTo(Categoria, {
  foreignKey: "id_categoria",
  as: "categoria",
});


// =============================
// EXPORTAR TODO
// =============================

module.exports = {
  sequelize,
  Plan,
  Empresa,
  Usuario,
  Categoria,
  Venta,
  Compra,
  Ingreso,
  Egreso,
};
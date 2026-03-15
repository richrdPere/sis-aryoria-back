// models/categoria.model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Categoria = sequelize.define("Categoria", {
  id_categoria: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM("ingreso", "egreso", "venta", "compra"),
    allowNull: false,
  },
}, {
  tableName: "categorias",
  timestamps: true,
});

module.exports = Categoria;
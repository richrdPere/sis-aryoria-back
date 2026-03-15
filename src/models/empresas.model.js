// models/empresa.model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Empresa = sequelize.define("Empresa", {
  id_empresa: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ruc: {
    type: DataTypes.STRING,
  },
  estado: {
    type: DataTypes.ENUM("activa", "suspendida"),
    defaultValue: "activa",
  },
  fecha_vencimiento: {
    type: DataTypes.DATE,
  },
}, {
  tableName: "empresas",
  timestamps: true,
});

module.exports = Empresa;
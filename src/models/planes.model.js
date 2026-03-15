// models/plan.model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Plan = sequelize.define("Plan", {
  id_plan: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  precio_mensual: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  limite_usuarios: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  limite_registros: {
    type: DataTypes.INTEGER,
    defaultValue: 1000,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: "planes",
  timestamps: true,
});

module.exports = Plan;
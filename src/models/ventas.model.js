// models/venta.model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Venta = sequelize.define("Venta", {
  id_venta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  descripcion: DataTypes.STRING,
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
}, {
  tableName: "ventas",
  timestamps: true,
});

module.exports = Venta;
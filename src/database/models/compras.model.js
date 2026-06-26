const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Compra = sequelize.define("Compra", {
  id_compra: {
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
  tableName: "compras",
  timestamps: true,
});

module.exports = Compra;
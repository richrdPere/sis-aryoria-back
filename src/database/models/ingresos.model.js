const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Ingreso = sequelize.define("Ingreso", {
  id_ingreso: {
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
  tableName: "ingresos",
  timestamps: true,
});

module.exports = Ingreso;
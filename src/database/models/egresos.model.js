const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Egreso = sequelize.define("Egreso", {
  id_egreso: {
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
  tableName: "egresos",
  timestamps: true,
});

module.exports = Egreso;
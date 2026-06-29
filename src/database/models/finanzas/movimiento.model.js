const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/database");

const Movimiento = sequelize.define("Movimiento", {

  id_movimiento: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },

  id_empresa: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },

  id_categoria: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },

  id_usuario: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },

  id_periodo: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },

  tipo: {
    type: DataTypes.ENUM(
      "INGRESO",
      "EGRESO"
    ),
    allowNull: false,
  },

  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },

  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },

  monto: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },

  observacion: {
    type: DataTypes.TEXT,
  },

  comprobante: {
    type: DataTypes.STRING(100),
  },

  estado: {
    type: DataTypes.ENUM(
      "PENDIENTE",
      "PAGADO",
      "ANULADO"
    ),
    defaultValue: "PAGADO",
  },

  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
},
  {
    tableName: "movimientos",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at"
  });

module.exports = Movimiento;
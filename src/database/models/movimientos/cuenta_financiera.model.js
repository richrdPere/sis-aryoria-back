const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/database");

const CuentaFinanciera = sequelize.define(
  "CuentaFinanciera",
  {
    id_cuenta: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    id_empresa: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    tipo: {
      type: DataTypes.ENUM(
        "EFECTIVO",
        "BANCO",
        "BILLETERA_DIGITAL",
        "CAJA_CHICA",
        "OTRA"
      ),
      allowNull: false,
    },

    moneda: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: "PEN",
    },

    saldo_inicial: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
      defaultValue: 0,
    },

    numero_cuenta: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    entidad_financiera: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },

    color: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    icono: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    es_principal: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "cuentas_financieras",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

module.exports = CuentaFinanciera;
const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/database");

const PeriodoContable = sequelize.define(
  "PeriodoContable",
  {
    id_periodo: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    id_empresa: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    anio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 2000,
      },
    },

    mes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 12,
      },
    },

    fecha_inicio: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    fecha_fin: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    estado: {
      type: DataTypes.ENUM(
        "ABIERTO",
        "CERRADO",
        "BLOQUEADO",
      ),
      defaultValue: "ABIERTO",
    },

    saldo_inicial: {
      type: DataTypes.DECIMAL(14, 2),
      defaultValue: 0,
    },

    saldo_final: {
      type: DataTypes.DECIMAL(14, 2),
      defaultValue: 0,
    },

    observacion: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "periodos_contables",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    // indexes: [
    //   {
    //     unique: true,
    //     fields: ["id_empresa", "anio", "mes"],
    //   },
    // ],
  }
);

module.exports = PeriodoContable;
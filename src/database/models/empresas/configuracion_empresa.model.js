const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/database");

const ConfiguracionEmpresa = sequelize.define(
  "ConfiguracionEmpresa",
  {
    id_configuracion: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    id_empresa: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },

    moneda: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: "PEN",
    },

    simbolo_moneda: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "S/",
    },

    zona_horaria: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "America/Lima",
    },

    porcentaje_igv: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 18,
    },

    calcular_igv: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    saldo_inicial_automatico: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    permitir_periodos_simultaneos: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    permitir_movimientos_fecha_anterior: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    notificar_presupuesto: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    porcentaje_alerta_presupuesto: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 80,
    },
  },
  {
    tableName: "configuraciones_empresa",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
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
      validate: {
        notEmpty: {
          msg: "El nombre del período es obligatorio.",
        },
        len: {
          args: [2, 100],
          msg: "El nombre debe tener entre 2 y 100 caracteres.",
        },
      },
    },

    anio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [2000],
          msg: "El año no puede ser menor a 2000.",
        },
        max: {
          args: [2100],
          msg: "El año no puede ser mayor a 2100.",
        },
      },
    },

    mes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: "El mes debe estar entre 1 y 12.",
        },
        max: {
          args: [12],
          msg: "El mes debe estar entre 1 y 12.",
        },
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
        "BLOQUEADO"
      ),
      allowNull: false,
      defaultValue: "ABIERTO",
    },

    saldo_inicial: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
      defaultValue: 0,
    },

    saldo_final: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
      defaultValue: 0,
    },

    observacion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "periodos_contables",

    timestamps: true,
    paranoid: true,

    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",

    validate: {
      fechaFinPosteriorAInicio() {
        if (
          this.fecha_inicio &&
          this.fecha_fin &&
          this.fecha_fin < this.fecha_inicio
        ) {
          throw new Error(
            "La fecha final no puede ser anterior a la fecha inicial."
          );
        }
      },
    },

    indexes: [
      {
        name: "uq_periodo_empresa_anio_mes",
        unique: true,
        fields: [
          "id_empresa",
          "anio",
          "mes",
        ],
      },
      {
        name: "idx_periodo_empresa_estado",
        fields: [
          "id_empresa",
          "estado",
        ],
      },
      {
        name: "idx_periodo_fechas",
        fields: [
          "fecha_inicio",
          "fecha_fin",
        ],
      },
    ],
  }
);

module.exports = PeriodoContable;
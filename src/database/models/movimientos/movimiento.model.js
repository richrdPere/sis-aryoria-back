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

  id_subcategoria: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },

  id_cuenta: {
    type: DataTypes.BIGINT,
    allowNull: true,
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
    validate: {
      isDate: {
        msg: "La fecha del movimiento no es válida.",
      },
    },
  },

  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: false,
    set(value) {
      this.setDataValue(
        "descripcion",
        typeof value === "string" ? value.trim() : value
      );
    },
    validate: {
      notEmpty: {
        msg: "La descripción del movimiento es obligatoria.",
      },
      len: {
        args: [2, 255],
        msg: "La descripción debe tener entre 2 y 255 caracteres.",
      },
    },
  },

  monto: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: {
      isDecimal: {
        msg: "El monto debe ser un número decimal válido.",
      },
      min: {
        args: [0.01],
        msg: "El monto debe ser mayor a cero.",
      },
    },
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
    deletedAt: "deleted_at",

    indexes: [
      {
        name: "idx_movimiento_empresa_periodo",
        fields: ["id_empresa", "id_periodo"],
      },
      {
        name: "idx_movimiento_empresa_fecha",
        fields: ["id_empresa", "fecha"],
      },
      {
        name: "idx_movimiento_empresa_tipo",
        fields: ["id_empresa", "tipo"],
      },
      {
        name: "idx_movimiento_categoria",
        fields: ["id_categoria"],
      },
      {
        name: "idx_movimiento_subcategoria",
        fields: ["id_subcategoria"],
      },
      {
        name: "idx_movimiento_periodo_estado",
        fields: ["id_periodo", "estado"],
      },
      {
        name: "idx_movimiento_reporte_general",
        fields: [
          "id_empresa",
          "id_periodo",
          "tipo",
          "estado",
          "activo",
        ],
      },
    ],
  });

module.exports = Movimiento;
// models/categoria.model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/database");

const Categoria = sequelize.define("Categoria", {
  id_categoria: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  id_empresa: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM(
      "INGRESO",
      "EGRESO"
    ),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },

  naturaleza: {
    type: DataTypes.ENUM(
      "VENTA",
      "COMPRA",
      "OTRO"
    ),
    allowNull: false,
    defaultValue: "OTRO",
  },

  color: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },

  icono: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },

  estado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  }

}, {
  tableName: "categorias",
  timestamps: true,
  paranoid: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",

  indexes: [
    {
      name: "uq_categoria_empresa_tipo_nombre",
      unique: true,
      fields: ["id_empresa", "tipo", "nombre"],
    },
    {
      name: "idx_categoria_empresa_estado",
      fields: ["id_empresa", "estado"],
    },
    {
      name: "idx_categoria_empresa_tipo_estado",
      fields: ["id_empresa", "tipo", "estado"],
    },
  ],
});

module.exports = Categoria;
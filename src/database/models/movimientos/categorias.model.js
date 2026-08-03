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
  },

  color: {
    type: DataTypes.STRING(20),
  },

  icono: {
    type: DataTypes.STRING(100),
  },

  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }

}, {
  tableName: "categorias",
  timestamps: true,
  paranoid: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
});

module.exports = Categoria;
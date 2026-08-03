const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/database");

const Subcategoria = sequelize.define(
  "Subcategoria",
  {
    id_subcategoria: {
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

    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
      set(value) {
        this.setDataValue(
          "nombre",
          typeof value === "string" ? value.trim() : value
        );
      },
      validate: {
        notEmpty: {
          msg: "El nombre de la subcategoría es obligatorio.",
        },
        len: {
          args: [2, 150],
          msg: "El nombre debe tener entre 2 y 150 caracteres.",
        },
      },
    },

    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true,
      set(value) {
        this.setDataValue(
          "descripcion",
          typeof value === "string" ? value.trim() : value
        );
      },
    },

    es_predeterminada: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    orden: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: "El orden no puede ser negativo.",
        },
      },
    },

    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "subcategorias",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",

    indexes: [
      {
        name: "uq_subcategoria_categoria_nombre",
        unique: true,
        fields: ["id_categoria", "nombre"],
      },
      {
        name: "idx_subcategoria_empresa",
        fields: ["id_empresa"],
      },
      {
        name: "idx_subcategoria_categoria_estado",
        fields: ["id_categoria", "estado"],
      },
    ],
  }
);

module.exports = Subcategoria;
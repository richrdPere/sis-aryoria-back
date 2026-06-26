const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Empresa = sequelize.define("Empresa", {
  id_empresa: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },

  razon_social: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },

  nombre_comercial: {
    type: DataTypes.STRING(200),
  },

  ruc: {
    type: DataTypes.STRING(11),
    allowNull: false,
    unique: true,
    validate: {
      len: [11, 11],
      isNumeric: true,
    },
  },

  tipo_empresa: {
    type: DataTypes.ENUM(
      "PRIVADA",
      "PUBLICA",
      "ONG",
      "INDEPENDIENTE",
      "OTRA"
    ),
    defaultValue: "PRIVADA",
  },

  direccion_fiscal: {
    type: DataTypes.STRING(255),
  },

  telefono: {
    type: DataTypes.STRING(20),
  },

  email: {
    type: DataTypes.STRING(150),
    validate: {
      isEmail: true,
    },
  },

  pagina_web: {
    type: DataTypes.STRING(255),
  },

  logo_url: {
    type: DataTypes.STRING,
  },

  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },

  // útil para auditoría o control interno
  activo_sunat: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: "empresas",
  timestamps: true,
  paranoid: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
});

module.exports = Empresa;
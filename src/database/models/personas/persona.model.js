const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/database");

const Persona = sequelize.define("Persona", {
  id_persona: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },

  nombres: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },

  apellidos: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING(150),
    validate: {
      isEmail: true
    }
  },

  tipo_documento: {
    type: DataTypes.ENUM(
      "DNI",
      "RUC",
      "CE",
      "PASAPORTE"
    ),
    defaultValue: "DNI",
  },

  numero_documento: {
    type: DataTypes.STRING(20),
    unique: true,
  },

  fecha_nacimiento: {
    type: DataTypes.DATEONLY,
  },

  celular: {
    type: DataTypes.STRING(20),
  },

  direccion: {
    type: DataTypes.STRING(255),
  },

  foto_url: {
    type: DataTypes.STRING,
  },

  genero: {
    type: DataTypes.ENUM(
      "M",
      "F",
      "OTRO"
    ),
  },

  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Persona;
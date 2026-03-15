// models/usuario.model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Usuario = sequelize.define("Usuario", {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellidos: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  documento_identidad: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  fecha_nacimiento: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  celular: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  rol: {
    type: DataTypes.ENUM("admin", "empleado", "cliente"),
    defaultValue: "admin",
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: "usuarios",
  timestamps: true,
});

module.exports = Usuario;
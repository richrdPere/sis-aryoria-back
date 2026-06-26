const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

// Utils
const crearAdminPorDefecto = require("./utils/initAdmin");
const crearRolesPorDefecto = require("./utils/initRoles");

// Routes
const router = require("./routes/index");

// Models
const db = require("./database/models");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

//  Rutas principales de la API
//  Multer maneja los archivos directamente, no se ve afectado por los límites anteriores
app.use("/api", router);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// FUNCIÓN DE INICIO
const startServer = async () => {
  try {

    await db.sequelize.authenticate();
    console.log("✅ Conexión a MySQL establecida");

    // 1. Sincronizar modelos (crea tablas si no existen)
    await db.sequelize.sync({ alter: true });
    console.log("📦 Modelos sincronizados");

    // 2. CREAR ROLES
    await crearRolesPorDefecto();

    // 3. CREAR USUARIO
    await crearAdminPorDefecto();

  } catch (error) {
    console.error("❌ Error al iniciar servidor:", error);
  }
};

startServer();

module.exports = app;

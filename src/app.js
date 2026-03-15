const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");


const crearAdminPorDefecto = require("./utils/initAdmin");
// const crearUsuariosPorDefecto = require("./utils/initUsuariosPorDefecto");

const router = require("./routes/index");
const db = require("./models");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

//  Rutas principales de la API
//  Multer maneja los archivos directamente, no se ve afectado por los límites anteriores
app.use("/api", router);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🔹 Conexión a la base de datos
db.sequelize
  .authenticate()
  .then(async () => {
    console.log("✅ Conexión a MySQL establecida");


    // Crear admin si no existe
    await crearAdminPorDefecto();

    // Crear usuarios prueba si no existe
    // await crearUsuariosPorDefecto();


    //  Sincronizar modelos (crea tablas si no existen)
    db.sequelize.sync({ alter: false }).then(() => {   // force ó alter: true
      console.log(" Modelos sincronizados con la base de datos");
    });

  })
  .catch((err) => console.error("❌ Error al conectar con MySQL:", err.message));

module.exports = app;

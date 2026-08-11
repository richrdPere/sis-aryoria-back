const express = require("express");
const cors = require("cors");
require("dotenv").config();

const path = require("path");
const fs = require("fs");

// Utils
const crearAdminPorDefecto = require("./utils/initAdmin");
const crearRolesPorDefecto = require("./utils/initRoles");

// Routes
const router = require("./routes/index");

// Models
const db = require("./database/models");

const app = express();

// ==========================================================
// CONFIGURACIÓN GENERAL
// ==========================================================

app.use(cors());

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// ==========================================================
// DIRECTORIO DE ARCHIVOS
// ==========================================================

/*
 * DESARROLLO:
 *
 * Si UPLOADS_DIR no existe en .env:
 *
 * backend/uploads
 *
 *
 * PRODUCCIÓN:
 *
 * UPLOADS_DIR=/var/www/aryoria/uploads
 */

const uploadsRoot =
  process.env.UPLOADS_DIR ||
  path.join(
    __dirname,
    "../../../uploads"
  );

// ==========================================================
// CREAR DIRECTORIO SI NO EXISTE
// ==========================================================
if (!fs.existsSync(uploadsRoot)) {
  fs.mkdirSync(
    uploadsRoot,
    {
      recursive: true,
    }
  );

  console.log(
    `📁 Directorio de uploads creado: ${uploadsRoot}`
  );
}

// ==========================================================
// ARCHIVOS ESTÁTICOS
// ==========================================================
app.use("/uploads", express.static(uploadsRoot, { maxAge: "30d", immutable: false, }));

// ==========================================================
// RUTAS PRINCIPALES DE LA API
// ==========================================================
app.use("/api", router);

// ==========================================================
// FUNCIÓN DE INICIO
// ==========================================================

const startServer = async () => {
  try {

    // MYSQL
    await db.sequelize.authenticate();

    console.log(
      "✅ Conexión a MySQL establecida"
    );

    // MODELOS
    await db.sequelize.sync({
      alter: false,
    });

    console.log(
      "📦 Modelos sincronizados"
    );

    // ROLES
    await crearRolesPorDefecto();

    // ADMIN
    await crearAdminPorDefecto();

    // UPLOADS
    console.log(
      `📁 Uploads disponibles en: ${uploadsRoot}`
    );
  } catch (error) {
    console.error(
      "❌ Error al iniciar servidor:",
      error
    );
  }
};

startServer();

module.exports = app;


// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();
// const path = require("path");

// // Utils
// const crearAdminPorDefecto = require("./utils/initAdmin");
// const crearRolesPorDefecto = require("./utils/initRoles");

// // Routes
// const router = require("./routes/index");

// // Models
// const db = require("./database/models");

// const app = express();

// app.use(cors());
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true }));

// //  Rutas principales de la API
// //  Multer maneja los archivos directamente, no se ve afectado por los límites anteriores
// app.use("/api", router);
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // FUNCIÓN DE INICIO
// const startServer = async () => {
//   try {

//     await db.sequelize.authenticate();
//     console.log("✅ Conexión a MySQL establecida");

//     // 1. Sincronizar modelos (crea tablas si no existen)
//     await db.sequelize.sync({ alter: false });
//     console.log("📦 Modelos sincronizados");


//     // if (process.env.NODE_ENV === "development") {
//     //   await db.sequelize.sync();
//     //   console.log("📦 Tablas faltantes verificadas");
//     // }

//     // 2. CREAR ROLES
//     await crearRolesPorDefecto();

//     // 3. CREAR USUARIO
//     await crearAdminPorDefecto();

//   } catch (error) {
//     console.error("❌ Error al iniciar servidor:", error);
//   }
// };

// startServer();

// module.exports = app;

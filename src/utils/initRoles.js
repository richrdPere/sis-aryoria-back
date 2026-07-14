const Roles = require("../database/models/auth/roles.model");

async function crearRolesPorDefecto() {
  try {
    console.log("🔍 Verificando roles por defecto...");

    const rolesSistema = [
      "SUPER_ADMIN",    // Administrador del SaaS. Solo existe para la plataforma.
      "ADMIN",          // Administrador de una empresa.
      "EMPLEADO",       // Empleado de una empresa.
      "CONTADOR",       // Contador de una empresa.
      "USUARIO"         // Usuario recién registrado. Todavía no administra ninguna empresa.
    ];

    for (const nombre of rolesSistema) {
      const [rol, created] = await Roles.findOrCreate({
        where: { nombre },
        defaults: { nombre },
      });

      if (created) {
        console.log(`✅ Rol creado: ${nombre}`);
      } else {
        console.log(`✔️ Rol ya existe: ${nombre}`);
      }
    }

    console.log("🚀 Roles verificados correctamente.");
  } catch (error) {
    console.error("❌ Error creando roles:", error.message);
  }
}

module.exports = crearRolesPorDefecto;
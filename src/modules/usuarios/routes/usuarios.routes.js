const express = require("express");
const router = express.Router();

// Middleware
const authMiddleware = require("../../../middlewares/auth.middleware");
router.use(authMiddleware);

const uploadPerfilFoto = require("../middleware/uploadPerfil.middleware");

// Controllers
const {
    getPerfilUsuarioController,
    updateFotoUsuarioController,
    updatePasswordUsuarioController,
    updatePerfilUsuarioController,
} = require("../controllers/usuarios.controller");

// ROUTES
router.get("/perfil", getPerfilUsuarioController);
router.put("/perfil", updatePerfilUsuarioController);
router.patch("/password", updatePasswordUsuarioController);
router.patch("/foto", uploadPerfilFoto.single("foto"), updateFotoUsuarioController);

module.exports = router;


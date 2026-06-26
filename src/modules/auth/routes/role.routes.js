const express = require("express");
const router = express.Router();

// Controllers
const roleController = require("../controllers/role.controller");

// Middlewares
const verifyToken = require("../middlewares/auth.middleware");

// ROLES
router.get("/roles", verifyToken, roleController.getAllRoles);
router.get("/users/:id_usuario/roles", verifyToken, roleController.getUserRoles);
router.post("/users/:id_usuario/roles", verifyToken, roleController.assignRoles);
router.put("/users/:id_usuario/roles", verifyToken, roleController.syncRoles);
router.delete("/users/:id_usuario/roles/:id_rol", verifyToken, roleController.removeRole);

module.exports = router;
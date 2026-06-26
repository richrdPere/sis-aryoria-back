const express = require("express");
const router = express.Router();

// Controllers
const authController = require("../controllers/auth.controller");
const passwordController = require("../controllers/password.controller");

// Validadores
const validateLogin = require("../validations/login.validator");
const validateRegister = require("../validations/register.validator");
const validatePassword = require("../validations/password.validator");
const validateResetPassword = require("../validations/reset_password.validator");
const validateIdParam = require("../validations/params.validator");

// Middlewares
const verifyToken = require("../middlewares/auth.middleware");


// 1. AUTENTICACIÓN
router.post("/register", validateRegister, authController.register);
router.post("/login", validateLogin, authController.login);
router.get("/me", verifyToken, authController.me);
router.get("/users/:id", verifyToken, validateIdParam, authController.getById);

// 2. CONTRASEÑAS
router.patch("/change-password", verifyToken, validatePassword, passwordController.changePassword);
router.patch("/reset-password/:id", verifyToken, validateResetPassword, passwordController.resetPassword);


module.exports = router;
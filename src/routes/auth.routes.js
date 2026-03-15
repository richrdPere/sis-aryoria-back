const express = require("express");
const { 
    registro_usuario, 
    login_usuario, 
    confirmar_cuenta } = require("../controllers/auth.controller");

const router = express.Router();

// router.get("/confirmar-cuenta/:token", confirmar_cuenta);
router.post("/confirmar-cuenta", confirmar_cuenta);
router.post("/register", registro_usuario);
router.post("/login", login_usuario);

module.exports = router;
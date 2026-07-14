const express = require("express");
const router = express.Router();

const {
    registerMovimiento,
    getMovimientosPaginado,
    getMovimientoById,
    updateMovimiento,
    deleteMovimiento
} = require("../controllers/movimiento.controller");


router.post("/crear", registerMovimiento);
router.get("/paginated", getMovimientosPaginado);
router.get("/detalle/:id", getMovimientoById);
router.put("/editar/:id", updateMovimiento);
router.delete("/eliminar/:id", deleteMovimiento);
module.exports = router;
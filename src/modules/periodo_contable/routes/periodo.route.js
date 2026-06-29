const express = require("express");
const router = express.Router();

const {
    createPeriodoC,
    getPeriodosCPaginado,
    getPeriodoCById,
    updatePeriodoC,
    deletePeriodoC,
    changeEstadoPeriodoC
} = require("../controllers/periodo.controller");

router.post("/crear", createPeriodoC);
router.get("/paginated", getPeriodosCPaginado);
router.get("/detalle/:id", getPeriodoCById);
router.put("/editar/:id", updatePeriodoC);
router.delete("/eliminar/:id", deletePeriodoC);
router.patch("/estado/:id", changeEstadoPeriodoC);

module.exports = router;
const express = require("express");
const router = express.Router();
const {
  createPlan,
  getPlanes,
  getPlanById,
  updatePlan,
  deletePlan,
} = require("../controllers/plan.controller");

// Crear plan
router.post("/", createPlan);

// Obtener todos
router.get("/", getPlanes);

// Obtener por ID
router.get("/:id", getPlanById);

// Actualizar
router.put("/:id", updatePlan);

// Eliminar
router.delete("/:id", deletePlan);

module.exports = router;
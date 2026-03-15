const Plan = require("../models/planes.model");

// ===============================
// CREAR PLAN
// ===============================
const createPlan = async (req, res) => {
    try {
        const {
            nombre,
            precio_mensual,
            limite_usuarios,
            limite_registros,
            activo,
        } = req.body;

        const nuevoPlan = await Plan.create({
            nombre,
            precio_mensual,
            limite_usuarios,
            limite_registros,
            activo,
        });

        return res.status(201).json(nuevoPlan);
    } catch (error) {
        return res.status(500).json({
            message: "Error al crear el plan",
            error: error.message,
        });
    }
};


// ===============================
// OBTENER TODAS (PAGINADO + BUSQUEDA)
// ===============================
const getPlanes = async (req, res) => {
    try {
        const planes = await Plan.findAll();
        return res.status(200).json(planes);
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener los planes",
            error: error.message,
        });
    }
};


// ===============================
// OBTENER POR ID
// ===============================
const getPlanById = async (req, res) => {
    try {
        const { id } = req.params;

        const plan = await Plan.findByPk(id);

        if (!plan) {
            return res.status(404).json({
                message: "Plan no encontrado",
            });
        }

        return res.status(200).json(plan);
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener el plan",
            error: error.message,
        });
    }
};


// ===============================
// ACTUALIZAR
// ===============================
const updatePlan = async (req, res) => {
    try {
        const { id } = req.params;

        const plan = await Plan.findByPk(id);

        if (!plan) {
            return res.status(404).json({
                message: "Plan no encontrado",
            });
        }

        await plan.update(req.body);

        return res.status(200).json({
            message: "Plan actualizado correctamente",
            plan,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al actualizar el plan",
            error: error.message,
        });
    }
};

// ===============================
// ELIMINAR
// ===============================
const deletePlan = async (req, res) => {
    try {
        const { id } = req.params;

        const plan = await Plan.findByPk(id);

        if (!plan) {
            return res.status(404).json({
                message: "Plan no encontrado",
            });
        }

        await plan.destroy();

        return res.status(200).json({
            message: "Plan eliminado correctamente",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al eliminar el plan",
            error: error.message,
        });
    }
};

module.exports = {
    createPlan,
    getPlanes,
    getPlanById,
    updatePlan,
    deletePlan,
};
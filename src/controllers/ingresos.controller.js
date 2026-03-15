const Ingreso = require("../models/ingresos.model");

// =====================================
// CREAR EMPRESA
// =====================================
const createIngreso = async (req, res) => {
    try {
        const { descripcion, monto, fecha } = req.body;

        const nuevoIngreso = await Ingreso.create({
            descripcion,
            monto,
            fecha,
        });

        res.status(201).json(nuevoIngreso);
    } catch (error) {
        res.status(500).json({
            message: "Error al crear el ingreso",
            error: error.message,
        });
    }
};

// =====================================
// OBTENER TODOS (PAGINADO + FILTROS)
// =====================================
const getIngresos = async (req, res) => {
    try {
        const ingresos = await Ingreso.findAll();
        res.status(200).json(ingresos);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener los ingresos",
            error: error.message,
        });
    }
};

// =====================================
// OBTENER POR ID
// =====================================
const getIngresoById = async (req, res) => {
    try {
        const { id } = req.params;

        const ingreso = await Ingreso.findByPk(id);

        if (!ingreso) {
            return res.status(404).json({
                message: "Ingreso no encontrado",
            });
        }

        res.status(200).json(ingreso);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener el ingreso",
            error: error.message,
        });
    }
};

// =====================================
// ACTUALIZAR
// =====================================
const updateIngreso = async (req, res) => {
    try {
        const { id } = req.params;

        const ingreso = await Ingreso.findByPk(id);

        if (!ingreso) {
            return res.status(404).json({
                message: "Ingreso no encontrado",
            });
        }

        await ingreso.update(req.body);

        res.status(200).json({
            message: "Ingreso actualizado correctamente",
            ingreso,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar el ingreso",
            error: error.message,
        });
    }
};

// =====================================
// ELIMINAR
// =====================================
const deleteIngreso = async (req, res) => {
    try {
        const { id } = req.params;

        const ingreso = await Ingreso.findByPk(id);

        if (!ingreso) {
            return res.status(404).json({
                message: "Ingreso no encontrado",
            });
        }

        await ingreso.destroy();

        res.status(200).json({
            message: "Ingreso eliminado correctamente",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar el ingreso",
            error: error.message,
        });
    }
};


module.exports = {
    createIngreso,
    getIngresos,
    getIngresoById,
    updateIngreso,
    deleteIngreso,
};
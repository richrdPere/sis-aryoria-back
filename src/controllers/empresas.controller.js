const Empresa = require("../models/empresas.model");


// =====================================
// CREAR EMPRESA
// =====================================
const crearEmpresa = async (req, res) => {
  try {
    const { nombre, ruc, estado, fecha_vencimiento } = req.body;

    const nuevaEmpresa = await Empresa.create({
      nombre,
      ruc,
      estado,
      fecha_vencimiento,
    });

    res.status(201).json(nuevaEmpresa);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear la empresa",
      error: error.message,
    });
  }
};

// =====================================
// OBTENER TODOS (PAGINADO + FILTROS)
// =====================================
const obtenerEmpresas = async (req, res) => {
  try {
    const empresas = await Empresa.findAll();
    res.status(200).json(empresas);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las empresas",
      error: error.message,
    });
  }
};

// =====================================
// OBTENER POR ID
// =====================================
const obtenerEmpresaById = async (req, res) => {
  try {
    const { id } = req.params;

    const empresa = await Empresa.findByPk(id);

    if (!empresa) {
      return res.status(404).json({
        message: "Empresa no encontrada",
      });
    }

    res.status(200).json(empresa);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la empresa",
      error: error.message,
    });
  }
};

// =====================================
// ACTUALIZAR
// =====================================
const actualizarEmpresa = async (req, res) => {
  try {
    const { id } = req.params;

    const empresa = await Empresa.findByPk(id);

    if (!empresa) {
      return res.status(404).json({
        message: "Empresa no encontrada",
      });
    }

    await empresa.update(req.body);

    res.status(200).json({
      message: "Empresa actualizada correctamente",
      empresa,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar la empresa",
      error: error.message,
    });
  }
};

// =====================================
// ELIMINAR
// =====================================
const eliminarEmpresa = async (req, res) => {
  try {
    const { id } = req.params;

    const empresa = await Empresa.findByPk(id);

    if (!empresa) {
      return res.status(404).json({
        message: "Empresa no encontrada",
      });
    }

    await empresa.destroy();

    res.status(200).json({
      message: "Empresa eliminada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar la empresa",
      error: error.message,
    });
  }
};

module.exports = {
  crearEmpresa,
  obtenerEmpresas,
  obtenerEmpresaById,
  actualizarEmpresa,
  eliminarEmpresa,
};
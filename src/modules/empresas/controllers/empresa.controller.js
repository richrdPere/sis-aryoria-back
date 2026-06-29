const { newEmpresaService, updateEmpresaService, getEmpresasService, deleteEmpresaService, getEmpresaByIdService } = require("../services");

// 1. Crear Empresa
const newEmpresa = async (req, res) => {
    try {
        const empresa = await newEmpresaService(req.body);

        return res.status(201).json({
            success: true,
            message: "Empresa creada correctamente.",
            data: empresa,
        });
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// 2. Listar Empresas paginado
const getEmpresasPaginated = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = "",
        } = req.query;

        const resultado = await getEmpresasService({
            page,
            limit,
            search,
        });

        return res.status(200).json({
            success: true,
            message: "Empresas obtenidas correctamente.",
            data: resultado.empresas,
            pagination: resultado.pagination,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Error al listar empresas.",
            error: error.message,
        });
    }
};

// 3. Aztualizar empresa
const updateEmpresa = async (req, res) => {
  try {
    const { id } = req.params;

    const empresa = await updateEmpresaService(
      id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Empresa actualizada correctamente.",
      data: empresa,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// 4. Eliminar empresa
const deleteEmpresa = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteEmpresaService(id);

    return res.status(200).json({
      success: true,
      message: "Empresa eliminada correctamente.",
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// 5. Obtener empresa por id
const getEmpresaById = async (req, res) => {
  try {
    const { id } = req.params;

    const empresa = await getEmpresaByIdService(id);

    return res.status(200).json({
      success: true,
      message: "Empresa obtenida correctamente.",
      data: empresa,
    });
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
    newEmpresa,
    getEmpresasPaginated,
    updateEmpresa,
    deleteEmpresa,
    getEmpresaById
};
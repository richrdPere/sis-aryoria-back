// Services
const {
  getSubcategoriasService,
  getSubcategoriasByCategoriaService,
  getSubcategoriaByIdService,
  createSubcategoriaService,
  updateSubcategoriaService,
  changeSubcategoriaEstadoService,
  deleteSubcategoriaService,
} = require("../services");

// Validators
const { obtenerIdEmpresa, } = require("../validators/subcategoria.validator");
/*
|--------------------------------------------------------------------------
| 1. Get Subcategorias
|--------------------------------------------------------------------------
*/
const getSubcategoriasController = async (
  req,
  res
) => {
  try {
    const idEmpresa =
      obtenerIdEmpresa(req);

    const result =
      await getSubcategoriasService({
        idEmpresa,
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
        idCategoria:
          req.query.id_categoria,
        tipo: req.query.tipo,
        estado: req.query.estado,
      });

    return res.status(200).json({
      success: true,
      message:
        "Subcategorías obtenidas correctamente.",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        "No se pudieron obtener las subcategorías.",
      error: error.message,
    });
  }
};
/*
|--------------------------------------------------------------------------
| 2. Get Subcategorias por Categoria
|--------------------------------------------------------------------------
*/
const getSubcategoriasByCategoriaController = async (req, res) => {
  try {
    const idEmpresa =
      obtenerIdEmpresa(req);

    const idCategoria = Number(
      req.params.idCategoria
    );

    if (
      !Number.isInteger(idCategoria) ||
      idCategoria <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "El identificador de la categoría no es válido.",
      });
    }

    const data =
      await getSubcategoriasByCategoriaService({
        idEmpresa,
        idCategoria,
        incluirInactivas:
          req.query.incluir_inactivas ===
          "true",
      });

    return res.status(200).json({
      success: true,
      message:
        "Subcategorías de la categoría obtenidas correctamente.",
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        "No se pudieron obtener las subcategorías de la categoría.",
      error: error.message,
    });
  }
};
/*
|--------------------------------------------------------------------------
| 3. Get Subcategorias por Id
|--------------------------------------------------------------------------
*/
const getSubcategoriaByIdController = async (
  req,
  res
) => {
  try {
    const idEmpresa = obtenerIdEmpresa(req);

    const idSubcategoria = Number(
      req.params.id
    );

    if (
      !Number.isInteger(
        idSubcategoria
      ) ||
      idSubcategoria <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "El identificador de la subcategoría no es válido.",
      });
    }

    const data =
      await getSubcategoriaByIdService({
        idEmpresa,
        idSubcategoria,
      });

    return res.status(200).json({
      success: true,
      message:
        "Subcategoría obtenida correctamente.",
      data,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message:
        "No se pudo obtener la subcategoría.",
      error: error.message,
    });
  }
};
/*
|--------------------------------------------------------------------------
| 4. Crear Subcategoria
|--------------------------------------------------------------------------
*/
const createSubcategoriaController = async (
  req,
  res
) => {
  try {
    const idEmpresa =
      obtenerIdEmpresa(req);

    const data =
      await createSubcategoriaService({
        idEmpresa,
        body: req.body,
      });

    return res.status(201).json({
      success: true,
      message:
        "Subcategoría creada correctamente.",
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        "No se pudo crear la subcategoría.",
      error: error.message,
    });
  }
};
/*
|--------------------------------------------------------------------------
| 5. Actualizar Subcategoria
|--------------------------------------------------------------------------
*/
const updateSubcategoriaController = async (
  req,
  res
) => {
  try {
    const idEmpresa =
      obtenerIdEmpresa(req);

    const idSubcategoria = Number(
      req.params.id
    );

    if (
      !Number.isInteger(
        idSubcategoria
      ) ||
      idSubcategoria <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "El identificador de la subcategoría no es válido.",
      });
    }

    const data =
      await updateSubcategoriaService({
        idEmpresa,
        idSubcategoria,
        body: req.body,
      });

    return res.status(200).json({
      success: true,
      message:
        "Subcategoría actualizada correctamente.",
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        "No se pudo actualizar la subcategoría.",
      error: error.message,
    });
  }
};
/*
|--------------------------------------------------------------------------
| 6. Cambiar Estado de Subcategoria
|--------------------------------------------------------------------------
*/
const changeSubcategoriaEstadoController = async (
  req,
  res
) => {
  try {
    const idEmpresa =
      obtenerIdEmpresa(req);

    const idSubcategoria = Number(
      req.params.id
    );

    if (
      !Number.isInteger(
        idSubcategoria
      ) ||
      idSubcategoria <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "El identificador de la subcategoría no es válido.",
      });
    }

    if (req.body.estado === undefined) {
      return res.status(400).json({
        success: false,
        message:
          "Debe enviar el estado de la subcategoría.",
      });
    }

    const data =
      await changeSubcategoriaEstadoService({
        idEmpresa,
        idSubcategoria,
        estado: req.body.estado,
      });

    return res.status(200).json({
      success: true,
      message:
        data.estado
          ? "Subcategoría activada correctamente."
          : "Subcategoría desactivada correctamente.",
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        "No se pudo cambiar el estado de la subcategoría.",
      error: error.message,
    });
  }
};
/*
|--------------------------------------------------------------------------
| 7. Eliminar una Subcategoria
|--------------------------------------------------------------------------
*/
const deleteSubcategoriaController = async (
  req,
  res
) => {
  try {
    const idEmpresa =
      obtenerIdEmpresa(req);

    const idSubcategoria = Number(
      req.params.id
    );

    if (
      !Number.isInteger(
        idSubcategoria
      ) ||
      idSubcategoria <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "El identificador de la subcategoría no es válido.",
      });
    }

    const data =
      await deleteSubcategoriaService({
        idEmpresa,
        idSubcategoria,
      });

    return res.status(200).json({
      success: true,
      message:
        "Subcategoría eliminada correctamente.",
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        "No se pudo eliminar la subcategoría.",
      error: error.message,
    });
  }
};

module.exports = {
  changeSubcategoriaEstadoController,
  createSubcategoriaController,
  deleteSubcategoriaController,
  getSubcategoriaByIdController,
  getSubcategoriasByCategoriaController,
  getSubcategoriasController,
  updateSubcategoriaController,
};
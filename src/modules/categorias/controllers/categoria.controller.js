const {
  createCategoriaService,
  getCategoriasService,
  getCategoriaByIdService,
  getCategoriaByTipoService,
  updateCategoriaService,
  deleteCategoriaService } = require("../services");

/*
|--------------------------------------------------------------------------
| 1. Crear categoria
|--------------------------------------------------------------------------
*/
const createCategoriaController = async (req, res) => {

  try {

    const categoria = await createCategoriaService(req.body);

    return res.status(201).json({
      success: true,
      message: "Categoría creada correctamente.",
      data: categoria,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: "No se pudo crear la categoria.",
      error: error.message,
    });
  }
};
/*
|--------------------------------------------------------------------------
| 2. Listar Categorias con paginado
|--------------------------------------------------------------------------
*/
const getCategoriasPaginadoController = async (req, res) => {
  try {

    const resultado = await getCategoriasService(req.query);

    return res.status(200).json({
      success: true,
      message: "Categorías obtenidas correctamente.",
      data: resultado,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Error al listar las categorias.",
      error: error.message
    });
  }
};
/*
|--------------------------------------------------------------------------
| 3.- Obtener categoria por ID
|--------------------------------------------------------------------------
*/
const getCategoriaByIdController = async (req, res) => {

  try {

    const { id } = req.params;
    const categoria = await getCategoriaByIdService(id);

    return res.status(200).json({
      success: true,
      message: "Categoría obtenida correctamente.",
      data: categoria

    });

  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "No se pudo obtener la categoria.",
      error: error.message
    });
  }
};
/*
|--------------------------------------------------------------------------
| 4.- Obtener categorias por Tipo
|--------------------------------------------------------------------------
*/
const getCategoriaByTipoController = async (req, res) => {
  try {
    const { tipo } = req.params;
    const { id_empresa } = req.query;

    const categorias = await getCategoriaByTipoService(
      tipo,
      id_empresa
    );

    return res.status(200).json({
      success: true,
      message: "Categorías obtenidas correctamente.",
      data: categorias
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "No se pudo obtener la categoria por tipo.",
      error: error.message
    });
  }
};
/*
|--------------------------------------------------------------------------
| 5. Actualizar categoria
|--------------------------------------------------------------------------
*/
const updateCategoriaController = async (req, res) => {

  try {

    const { id } = req.params;
    const categoria = await updateCategoriaService(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Categoría actualizada correctamente.",
      data: categoria
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: "No se pudo actualizar la categoria.",
      error: error.message
    });
  }
};
/*
|--------------------------------------------------------------------------
| 6. Eliminar categoria
|--------------------------------------------------------------------------
*/
const deleteCategoriaController = async (req, res) => {

  try {

    const { id } = req.params;
    await deleteCategoriaService(id);

    return res.status(200).json({
      success: true,
      message: "Categoría eliminada correctamente."

    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: "No se pudo eliminar la categoria.",
      error: error.message
    });
  }
};


module.exports = {
  createCategoriaController,
  deleteCategoriaController,
  getCategoriaByIdController,
  getCategoriaByTipoController,
  getCategoriasPaginadoController,
  updateCategoriaController,
};
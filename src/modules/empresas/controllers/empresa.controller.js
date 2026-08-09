const { newEmpresaService, updateEmpresaService, getEmpresasService, deleteEmpresaService, getEmpresaByIdService, selectEmpresaService } = require("../services");

/*
|--------------------------------------------------------------------------
| 1. Crear Empresa
|--------------------------------------------------------------------------
*/
const newEmpresaController = async (req, res) => {
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
      message: "No se pudo crear la empresa.",
      error: error.message,
    });
  }
};
/*
|--------------------------------------------------------------------------
| 2. Listar Empresas paginado
|--------------------------------------------------------------------------
*/
const getEmpresasPaginatedController = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
    } = req.query;

    const id_usuario = req.usuario.id_usuario;

    console.log("ID USUARIO PAGINADO: ", id_usuario);

    const resultado = await getEmpresasService({
      id_usuario,
      page,
      limit,
      search,
    });

    return res.status(200).json({
      success: true,
      message: "Empresas obtenidas correctamente.",
      data: resultado,
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
/*
|--------------------------------------------------------------------------
| 3. Actualizar empresa
|--------------------------------------------------------------------------
*/
const updateEmpresaController = async (req, res) => {
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
      message: "No se pudo actualizar la empresa.",
      error: error.message,
    });
  }
};
/*
|--------------------------------------------------------------------------
| 4. Eliminar empresa
|--------------------------------------------------------------------------
*/
const deleteEmpresaController = async (req, res) => {
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
      message: "No se pudo eliminar la empresa.",
      error: error.message,
    });
  }
};
/*
|--------------------------------------------------------------------------
| 5. Obtener empresa por id
|--------------------------------------------------------------------------
*/
const getEmpresaByIdController = async (req, res) => {
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
      message: "No se pudo obtener la empresa.",
      error: error.message,
    });
  }
};
/*
|--------------------------------------------------------------------------
| 6. Seleccionar empresa
|--------------------------------------------------------------------------
*/
const selectEmpresaController = async (req, res, next) => {

  try {

    const response =
      await selectEmpresaService({
        id_usuario: req.usuario.id_usuario,
        id_empresa: req.body.id_empresa,
      });

    return res.status(200).json({
      success: true,
      message: "Empresa seleccionada correctamente.",
      data: response,
    });

  } catch (error) {
    console.error(error);

    return res.status(404).json({
      success: false,
      message: "No se pudo seleccionar la empresa.",
      error: error.message,
    });
  }

};


module.exports = {
  deleteEmpresaController,
  getEmpresaByIdController,
  getEmpresasPaginatedController,
  newEmpresaController,
  selectEmpresaController,
  updateEmpresaController,
};
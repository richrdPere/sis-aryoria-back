
const { createPeriodoCService, getPeriodosCService, getPeriodoCByIdService, updatePeriodoCService, deletePeriodoCService, changeEstadoPeriodoCService } = require("../services");

/*
|--------------------------------------------------------------------------
| 1. Crear Período Contable
|--------------------------------------------------------------------------
*/
const createPeriodoContableController = async (req, res) => {

  try {

    const periodo = await createPeriodoCService(req.body);

    return res.status(201).json({
      success: true,
      message: "Período contable creado correctamente.",
      data: periodo

    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: "No se pudo crear el periodo contable.",
      error: error.message
    });
  }
};
/*
|--------------------------------------------------------------------------
| 2. Listar Periodos Contables
|--------------------------------------------------------------------------
*/
const getPeriodosCPaginadoController = async (req, res) => {

  try {

    const periodos = await getPeriodosCService(req.query);

    return res.status(200).json({
      success: true,
      message: "Períodos contables obtenidos correctamente.",
      data: periodos

    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: "Error al listar los periodos contable.",
      error: error.message
    });
  }
};
/*
|--------------------------------------------------------------------------
| 3. Obtener período contable por ID
|--------------------------------------------------------------------------
*/
const getPeriodoCByIdController = async (req, res) => {

  try {

    const { id } = req.params;
    const { id_empresa } = req.query;

    const periodo = await getPeriodoCByIdService(
      id,
      id_empresa
    );

    return res.status(200).json({
      success: true,
      message: "Período contable obtenido correctamente.",
      data: periodo

    });

  } catch (error) {

    return res.status(404).json({
      success: false,
      message: "No se pudo obtener el periodo contable.",
      error: error.message
    });
  }
};
/*
|--------------------------------------------------------------------------
| 4. Actualizar Período Contable
|--------------------------------------------------------------------------
*/
const updatePeriodoContableController = async (req, res) => {

  try {

    const { id } = req.params;
    const { id_empresa } = req.query;

    const periodo = await updatePeriodoCService(
      id,
      id_empresa,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Período contable actualizado correctamente.",
      data: periodo
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: "No se pudo actualizar el periodo contable.",
      error: error.message
    });
  }
};
/*
|--------------------------------------------------------------------------
| 5. Eliminar Período Contable
|--------------------------------------------------------------------------
*/
const deletePeriodoContableController = async (req, res) => {

  try {

    const { id } = req.params;
    const { id_empresa } = req.query;

    await deletePeriodoCService(
      id,
      id_empresa
    );

    return res.status(200).json({
      success: true,
      message: "Período contable eliminado correctamente."
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: "No se pudo eliminar el periodo contable.",
      error: error.message
    });
  }
};
/*
|--------------------------------------------------------------------------
| 6. Cambiar el estado del Periodo Contable
|--------------------------------------------------------------------------
*/
const changeEstadoPeriodoContableController = async (req, res) => {

  try {

    const { id } = req.params;

    const { id_empresa } = req.query;

    const { estado } = req.body;

    const periodo = await changeEstadoPeriodoCService(
      id,
      id_empresa,
      estado
    );

    return res.status(200).json({
      success: true,
      message: "Estado actualizado correctamente.",
      data: periodo
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  changeEstadoPeriodoContableController,
  createPeriodoContableController,
  deletePeriodoContableController,
  getPeriodoCByIdController,
  getPeriodosCPaginadoController,
  updatePeriodoContableController,
};
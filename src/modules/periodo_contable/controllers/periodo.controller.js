
const { createPeriodoCService, getPeriodosCService, getPeriodoCByIdService, updatePeriodoCService, deletePeriodoCService, changeEstadoPeriodoCService } = require("../services");

/*
|--------------------------------------------------------------------------
| 1. Crear Período Contable
|--------------------------------------------------------------------------
*/
const createPeriodoC = async (req, res) => {

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
      message: error.message
    });
  }
};
/*
|--------------------------------------------------------------------------
| 2. Listar Periodos Contables
|--------------------------------------------------------------------------
*/
const getPeriodosCPaginado = async (req, res) => {

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
      message: error.message
    });
  }
};
/*
|--------------------------------------------------------------------------
| 3. Obtener período contable por ID
|--------------------------------------------------------------------------
*/
const getPeriodoCById = async (req, res) => {

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
      message: error.message
    });
  }
};
/*
|--------------------------------------------------------------------------
| 4. Actualizar Período Contable
|--------------------------------------------------------------------------
*/
const updatePeriodoC = async (req, res) => {

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
      message: error.message
    });
  }
};
/*
|--------------------------------------------------------------------------
| 5. Eliminar Período Contable
|--------------------------------------------------------------------------
*/
const deletePeriodoC = async (req, res) => {

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
      message: error.message
    });
  }
};
/*
|--------------------------------------------------------------------------
| 6. Cambiar el estado del Periodo Contable
|--------------------------------------------------------------------------
*/
const changeEstadoPeriodoC = async (req, res) => {

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
  createPeriodoC,
  getPeriodosCPaginado,
  getPeriodoCById,
  updatePeriodoC,
  deletePeriodoC,
  changeEstadoPeriodoC
};
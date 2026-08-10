const {
  registerMovimientoService,
  getMovimientosService,
  getMovimientoByIdService,
  updateMovimientoService,
  deleteMovimientoService,
} = require("../services");

/*
|--------------------------------------------------------------------------
| 1. Registrar Movimiento
|--------------------------------------------------------------------------
*/
const registerMovimientoController = async (req, res) => {
  try {

    const movimiento = await registerMovimientoService(req.body);

    return res.status(201).json({
      success: true,
      message: "Movimiento registrado correctamente.",
      data: movimiento,

    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: "No se pudo crear el movimiento.",
      error: error.message,
    });
  }
};
/*
|--------------------------------------------------------------------------
| 2. Listar movimientos paginado
|--------------------------------------------------------------------------
*/
const getMovimientosPaginadoController = async (req, res) => {

  try {

    const resultado = await getMovimientosService(req.query);

    return res.status(200).json({
      success: true,
      message: "Movimientos obtenidos correctamente.",
      data: resultado,
    });

  }

  catch (error) {

    return res.status(500).json({
      success: false,
      message: "Error al listar los movimientos.",
      error: error.message,
    });
  }
};
/*
|--------------------------------------------------------------------------
| 3. Obtener movimiento por ID
|--------------------------------------------------------------------------
*/
const getMovimientoByIdController = async (req, res) => {

  try {

    const { id } = req.params;
    const { id_empresa } = req.query;

    const movimiento = await getMovimientoByIdService(
      id,
      id_empresa
    );

    return res.status(200).json({
      success: true,
      message: "Movimiento obtenido correctamente.",
      data: movimiento,
    });

  } catch (error) {

    return res.status(404).json({
      success: false,
      message: "No se pudo obtener el movimiento.",
      error: error.message,
    });
  }
};
/*
|--------------------------------------------------------------------------
| 4. Actualizar movimiento
|--------------------------------------------------------------------------
*/
const updateMovimientoController = async (req, res) => {

  try {

    const { id } = req.params;
    const { id_empresa } = req.query;

    const movimiento = await updateMovimientoService(id, id_empresa, req.body);

    return res.status(200).json({
      success: true,
      message: "Movimiento actualizado correctamente.",
      data: movimiento,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: "No se pudo actualizar el movimiento.",
      error: error.message,
    });
  }
};
/*
|--------------------------------------------------------------------------
| 5. Eliminar movimiento
|--------------------------------------------------------------------------
*/
const deleteMovimientoController = async (req, res) => {

  try {

    const { id } = req.params;
    const { id_empresa } = req.query;

    await deleteMovimientoService(
      id,
      id_empresa
    );

    return res.status(200).json({
      success: true,
      message: "Movimiento eliminado correctamente.",
    });

  }

  catch (error) {

    return res.status(400).json({
      success: false,
      message: "No se pudo eliminar el movimiento.",
      error: error.message,
    });
  }
};

module.exports = {
  deleteMovimientoController,
  getMovimientoByIdController,
  getMovimientosPaginadoController,
  registerMovimientoController,
  updateMovimientoController,
}
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
const registerMovimiento = async (req, res) => {
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
      message: error.message,
    });
  }
};
/*
|--------------------------------------------------------------------------
| 2. Listar movimientos
|--------------------------------------------------------------------------
*/
const getMovimientosPaginado = async (req, res) => {

  try {

    const resultado = await getMovimientosService(req.query);

    return res.status(200).json({
      success: true,
      message: "Movimientos obtenidos correctamente.",
      data: resultado.movimientos,
      pagination: resultado.pagination
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
const getMovimientoById = async (req, res) => {

  try {

    const { id } = req.params;

    const movimiento = await getMovimientoByIdService(id);

    return res.status(200).json({
      success: true,
      message: "Movimiento obtenido correctamente.",
      data: movimiento,
    });

  } catch (error) {

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
/*
|--------------------------------------------------------------------------
| 4. Actualizar movimiento
|--------------------------------------------------------------------------
*/
const updateMovimiento = async (req, res) => {

  try {

    const { id } = req.params;

    const movimiento = await updateMovimientoService(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Movimiento actualizado correctamente.",
      data: movimiento,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
/*
|--------------------------------------------------------------------------
| 5. Eliminar movimiento
|--------------------------------------------------------------------------
*/
const deleteMovimiento = async (req, res) => {

  try {

    const { id } = req.params;

    await deleteMovimientoService(id);

    return res.status(200).json({
      success: true,
      message: "Movimiento eliminado correctamente.",
    });

  }

  catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerMovimiento,
  getMovimientosPaginado,
  getMovimientoById,
  updateMovimiento,
  deleteMovimiento
}
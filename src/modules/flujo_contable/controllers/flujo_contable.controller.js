const {
  getFlujoContableAnualService,
  getFlujoContableMensualService,
  getFlujoProyectadoMensualService,
} = require("../services")

/*
|--------------------------------------------------------------------------
| 1. Obtener Flujo Contable Mensual
|--------------------------------------------------------------------------
*/
const getFlujoMensualController = async (req, res) => {

  try {
    const { id_empresa } = req.query;
    const { idPeriodo } = req.params;

    if (!id_empresa) {
      return res.status(400).json({
        success: false,
        message: "No se pudo identificar la empresa activa.",
      });
    }

    const data = await getFlujoContableMensualService({
      id_empresa,
      id_periodo: idPeriodo,
    });

    return res.status(200).json({
      success: true,
      message: "Flujo contable mensual obtenido correctamente.",
      data,
    });
  } catch (error) {
    console.error("Error al obtener flujo contable mensual:", error
    );

    return res.status(500).json({
      success: false,
      message: "No se pudo obtener el flujo contable mensual.",
      error: error.message,

    });
  }
}
/*
|--------------------------------------------------------------------------
| 2. Obtener Flujo Proyectado
|--------------------------------------------------------------------------
*/
const getFlujoProyectadoController = async (req, res) => {

  try {
    const { id_empresa } = req.query;
    const { idPeriodo } = req.params;

    if (!id_empresa) {
      return res.status(400).json({
        success: false,
        message: "No se pudo identificar la empresa activa.",
      });
    }

    const data = await getFlujoProyectadoMensualService({
      id_empresa,
      id_periodo: idPeriodo,
    });

    return res.status(200).json({
      success: true,
      message: "Flujo proyectado obtenido correctamente.",
      data,
    });
  } catch (error) {
    console.error("Error al obtener flujo proyectado:", error
    );

    return res.status(500).json({
      success: false,
      message: "No se pudo obtener el flujo proyectado.",
      error: error.message,

    });
  }
}
/*
|--------------------------------------------------------------------------
| 3. Obtener Flujo Contable Anual
|--------------------------------------------------------------------------
*/
const getFlujoAnualController = async (req, res) => {
  try {

    const { id_empresa, anio } = req.query;

    if (!id_empresa) {
      return res.status(400).json({
        success: false,
        message:
          "No se pudo identificar la empresa activa.",
        data: null,
      });
    }

    if (!anio) {
      return res.status(400).json({
        success: false,
        message: "Debe indicar el año del flujo contable.",
      });
    }

    const data = await getFlujoContableAnualService({ id_empresa, anio, });

    return res.status(200).json({
      success: true,
      message: "Flujo contable anual obtenido correctamente.",
      data,
    });
  } catch (error) {
    console.error("Error al obtener flujo contable anual:", error);

    return res.status(500).json({
      success: false,
      message: "No se pudo obtener el flujo contable anual.",
      error: error.message,
    });
  }
}

module.exports = {
  getFlujoMensualController,
  getFlujoProyectadoController,
  getFlujoAnualController,
};
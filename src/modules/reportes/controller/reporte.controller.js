const {
  getEvolucionPeriodoService,
  getReporteCategoriasService,
  getReporteGeneralService,
  getResumenPeriodoService
} = require("../services")

/*
|--------------------------------------------------------------------------
| 1. Obtener Evolucion por Periodo
|--------------------------------------------------------------------------
*/
const getEvolucionPeriodoController = async (req, res) => {
  try {
    const { id_empresa, id_periodo } = req.query;

    if (!id_empresa || !id_periodo) {
      return res.status(400).json({
        success: false,
        message:
          'El id de la empresa y el id del período son obligatorios.',
      });
    }

    const idEmpresa = Number(id_empresa);
    const idPeriodo = Number(id_periodo);

    if (!Number.isInteger(idEmpresa) || idEmpresa <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El id de la empresa no es válido.',
      });
    }

    if (!Number.isInteger(idPeriodo) || idPeriodo <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El id del período no es válido.',
      });
    }

    const data = await getEvolucionPeriodoService({
      id_empresa: idEmpresa,
      id_periodo: idPeriodo,
    });

    return res.status(200).json({
      success: true,
      message: 'Evolución del período obtenida correctamente.',
      data,
    });
  } catch (error) {
    console.error(
      'ERROR GET EVOLUCIÓN DEL PERÍODO:',
      error,
    );

    return res.status(error.statusCode ?? 500).json({
      success: false,
      message:
        error.statusCode && error.statusCode < 500
          ? error.message
          : 'No fue posible obtener la evolución del período.',
      error: error.message,
    });
  }
};
/*
|--------------------------------------------------------------------------
| 2. Obtener Reporte por Categoria
|--------------------------------------------------------------------------
*/
const getReporteCategoriasController = async (req, res) => {
  try {
    const {
      id_empresa,
      id_periodo,
      tipo,
    } = req.query;

    if (!id_empresa || !id_periodo) {
      return res.status(400).json({
        success: false,
        message:
          'El id de la empresa y el id del período son obligatorios.',
      });
    }

    const idEmpresa = Number(id_empresa);
    const idPeriodo = Number(id_periodo);

    if (!Number.isInteger(idEmpresa) || idEmpresa <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El id de la empresa no es válido.',
      });
    }

    if (!Number.isInteger(idPeriodo) || idPeriodo <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El id del período no es válido.',
      });
    }

    const tipoNormalizado = tipo
      ? tipo.toString().trim().toUpperCase()
      : undefined;

    const data = await getReporteCategoriasService({
      id_empresa: idEmpresa,
      id_periodo: idPeriodo,
      tipo: tipoNormalizado,
    });

    return res.status(200).json({
      success: true,
      message:
        'Reporte por categorías obtenido correctamente.',
      data,
    });
  } catch (error) {
    console.error(
      'ERROR GET REPORTE POR CATEGORÍAS:',
      error,
    );

    return res
      .status(error.statusCode ?? 500)
      .json({
        success: false,

        message:
          error.statusCode && error.statusCode < 500
            ? error.message
            : 'No fue posible obtener el reporte por categorías.',

        error: error.message,
      });
  }
};
/*
|--------------------------------------------------------------------------
| 3. Obtener Reporte General
|--------------------------------------------------------------------------
*/
const getReporteGeneralController = async (
  req,
  res,
) => {
  try {
    const {
      id_empresa,
      id_periodo,
    } = req.query;

    if (!id_empresa || !id_periodo) {
      return res.status(400).json({
        success: false,
        message:
          'El id de la empresa y el id del período son obligatorios.',
      });
    }

    const idEmpresa = Number(id_empresa);
    const idPeriodo = Number(id_periodo);

    if (
      !Number.isInteger(idEmpresa) ||
      idEmpresa <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          'El id de la empresa no es válido.',
      });
    }

    if (
      !Number.isInteger(idPeriodo) ||
      idPeriodo <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          'El id del período no es válido.',
      });
    }

    const data =
      await getReporteGeneralService({
        id_empresa: idEmpresa,
        id_periodo: idPeriodo,
      });

    return res.status(200).json({
      success: true,
      message:
        'Reporte general obtenido correctamente.',
      data,
    });
  } catch (error) {
    console.error(
      'ERROR GET REPORTE GENERAL:',
      error,
    );

    return res
      .status(error.statusCode ?? 500)
      .json({
        success: false,

        message:
          error.statusCode &&
            error.statusCode < 500
            ? error.message
            : 'No fue posible obtener el reporte general.',

        error: error.message,
      });
  }
};
/*
|--------------------------------------------------------------------------
| 4. Obtener Resumen Periodo
|--------------------------------------------------------------------------
*/
const getResumenPeriodoController = async (req, res) => {
  try {
    const {
      id_empresa,
      id_periodo,
    } = req.query;

    if (!id_empresa || !id_periodo) {
      return res.status(400).json({
        success: false,
        message:
          'El id de la empresa y el id del período son obligatorios.',
      });
    }

    const idEmpresa = Number(id_empresa);
    const idPeriodo = Number(id_periodo);

    if (
      !Number.isInteger(idEmpresa) ||
      idEmpresa <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          'El id de la empresa no es válido.',
      });
    }

    if (
      !Number.isInteger(idPeriodo) ||
      idPeriodo <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          'El id del período no es válido.',
      });
    }

    const data =
      await getResumenPeriodoService({
        id_empresa: idEmpresa,
        id_periodo: idPeriodo,
      });

    return res.status(200).json({
      success: true,
      message:
        'Resumen del período obtenido correctamente.',
      data,
    });
  } catch (error) {
    console.error(
      'ERROR GET RESUMEN DEL PERÍODO:',
      error,
    );

    return res
      .status(error.statusCode ?? 500)
      .json({
        success: false,

        message:
          error.statusCode &&
            error.statusCode < 500
            ? error.message
            : 'No fue posible obtener el resumen del período.',

        error: error.message,
      });
  }
};


module.exports = {
  getEvolucionPeriodoController,
  getReporteCategoriasController,
  getReporteGeneralController,
  getResumenPeriodoController
};
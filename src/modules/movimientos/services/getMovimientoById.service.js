const db = require("../../../database/models");

// Modelos
const {
    Movimiento,
    Empresa,
    Categoria,
    Subcategoria,
    Usuario,
    PeriodoContable,
    // Cuenta, // Descomenta si ya tienes esta relación
} = db;

const getMovimientoById = async (idMovimiento, idEmpresa) => {
    // ==========================================================
    // VALIDACIONES
    // ==========================================================
    if (!idMovimiento) {
        throw new Error("Debe indicar el movimiento.");
    }

    if (!idEmpresa) {
        throw new Error("Debe indicar la empresa.");
    }

    // ==========================================================
    // CONSULTA
    // ==========================================================
    const movimiento = await Movimiento.findOne({
        where: {
            id_movimiento: idMovimiento,
            id_empresa: idEmpresa,
            activo: true,
        },

        include: [
            {
                model: Empresa,
                as: "empresa",
                attributes: [
                    "id_empresa",
                    "razon_social",
                    "nombre_comercial",
                    "ruc",
                ],
            },

            {
                model: Categoria,
                as: "categoria",
                attributes: [
                    "id_categoria",
                    "nombre",
                    "tipo",
                    "color",
                    "icono",
                ],
            },

            {
                model: Subcategoria,
                as: "subcategoria",
                attributes: [
                    "id_subcategoria",
                    "id_categoria",
                    "nombre",
                    "naturaleza",
                    "estado",
                ],
            },

            {
                model: Usuario,
                as: "usuario",
                attributes: [
                    "id_usuario",
                    "username",
                    "email",
                ],
            },

            {
                model: PeriodoContable,
                as: "periodoContable",
                attributes: [
                    "id_periodo",
                    "nombre",
                    "anio",
                    "mes",
                    "estado",
                    "fecha_inicio",
                    "fecha_fin",
                    "saldo_inicial",
                    "saldo_final",
                ],
            },

            // ======================================================
            // SI YA TIENES CUENTA
            // ======================================================

            /*
            {
              model: Cuenta,
              as: "cuenta",
              attributes: [
                "id_cuenta",
                "nombre",
                "tipo",
              ],
              required: false,
            },
            */
        ],
    });

    // ==========================================================
    // VALIDAR RESULTADO
    // ==========================================================
    if (!movimiento) {
        throw new Error(
            "Movimiento no encontrado o no pertenece a la empresa."
        );
    }

    return movimiento;
};

module.exports = getMovimientoById;
const db = require("../../../database/models");

// Modelos
const {
    Movimiento,
    Empresa,
    Categoria,
    Usuario,
    PeriodoContable,
} = db;

const getMovimientoById = async (id) => {

    const movimiento = await Movimiento.findByPk(id, {

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
                ],
            },
        ],
    });

    if (!movimiento) {
        throw new Error("Movimiento no encontrado.");
    }

    return movimiento;
};

module.exports = getMovimientoById;
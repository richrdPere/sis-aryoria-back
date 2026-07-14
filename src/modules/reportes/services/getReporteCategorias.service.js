const { fn, col, literal } = require('sequelize');
const db = require("../../../database/models");

// Modelos
const { Movimiento, Categoria, PeriodoContable } = db;


/**
 * Obtiene el reporte agrupado por categorías
 * para una empresa y período contable.
 */
const getReporteCategoriasService = async ({
    id_empresa,
    id_periodo,
    tipo,
}) => {
    if (!id_empresa) {
        const error = new Error('El id de la empresa es obligatorio.');
        error.statusCode = 400;
        throw error;
    }

    if (!id_periodo) {
        const error = new Error('El id del período es obligatorio.');
        error.statusCode = 400;
        throw error;
    }

    const tiposPermitidos = ['INGRESO', 'EGRESO'];

    if (tipo && !tiposPermitidos.includes(tipo)) {
        const error = new Error(
            'El tipo debe ser INGRESO o EGRESO.',
        );

        error.statusCode = 400;
        throw error;
    }

    const periodo = await PeriodoContable.findOne({
        where: {
            id_periodo,
            id_empresa,
        },
        attributes: [
            'id_periodo',
            'id_empresa',
            'nombre',
            'anio',
            'mes',
            'fecha_inicio',
            'fecha_fin',
            'estado',
        ],
        raw: true,
    });

    if (!periodo) {
        const error = new Error(
            'El período contable no existe o no pertenece a la empresa.',
        );

        error.statusCode = 404;
        throw error;
    }

    const whereMovimiento = {
        id_empresa,
        id_periodo,
        activo: true,
    };

    if (tipo) {
        whereMovimiento.tipo = tipo;
    }

    /*
     * Se obtiene el total general por tipo para calcular
     * el porcentaje de cada categoría.
     */
    const totalesPorTipoRaw = await Movimiento.findAll({
        where: whereMovimiento,
        attributes: [
            'tipo',
            [
                fn('SUM', col('monto')),
                'total',
            ],
            [
                fn('COUNT', col('id_movimiento')),
                'cantidad',
            ],
        ],
        group: ['tipo'],
        raw: true,
    });

    const totalesPorTipo = {
        INGRESO: {
            total: 0,
            cantidad: 0,
        },
        EGRESO: {
            total: 0,
            cantidad: 0,
        },
    };

    for (const item of totalesPorTipoRaw) {
        const tipoMovimiento = item.tipo;

        if (!totalesPorTipo[tipoMovimiento]) {
            continue;
        }

        totalesPorTipo[tipoMovimiento] = {
            total: Number(item.total ?? 0),
            cantidad: Number(item.cantidad ?? 0),
        };
    }

    /*
     * Agrupar movimientos por categoría y tipo.
     */
    const categoriasRaw = await Movimiento.findAll({
        where: whereMovimiento,
        attributes: [
            'id_categoria',
            'tipo',

            [
                fn('SUM', col('monto')),
                'total',
            ],

            [
                fn('COUNT', col('Movimiento.id_movimiento')),
                'cantidad_movimientos',
            ],

            [
                fn('AVG', col('monto')),
                'promedio_movimiento',
            ],

            [
                fn('MIN', col('monto')),
                'monto_minimo',
            ],

            [
                fn('MAX', col('monto')),
                'monto_maximo',
            ],
        ],
        include: [
            {
                model: Categoria,
                as: 'categoria',
                attributes: [
                    'id_categoria',
                    'nombre',
                    'tipo',
                    'descripcion',
                    'color',
                    'icono',
                ],
                required: false,
            },
        ],
        group: [
            'Movimiento.id_categoria',
            'Movimiento.tipo',
            'categoria.id_categoria',
            'categoria.nombre',
            'categoria.tipo',
            'categoria.descripcion',
            'categoria.color',
            'categoria.icono',
        ],
        order: [
            [literal('total'), 'DESC'],
        ],
        raw: true,
        nest: true,
    });

    const categorias = categoriasRaw.map((item) => {
        const total = Number(item.total ?? 0);

        const cantidadMovimientos = Number(
            item.cantidad_movimientos ?? 0,
        );

        const totalDelTipo =
            totalesPorTipo[item.tipo]?.total ?? 0;

        const porcentaje = totalDelTipo > 0
            ? (total / totalDelTipo) * 100
            : 0;

        return {
            id_categoria: Number(item.id_categoria),
            tipo: item.tipo,

            categoria: {
                id_categoria:
                    Number(item.categoria?.id_categoria) ||
                    Number(item.id_categoria),

                nombre:
                    item.categoria?.nombre ??
                    'Sin categoría',

                tipo:
                    item.categoria?.tipo ??
                    item.tipo,

                descripcion:
                    item.categoria?.descripcion ?? null,

                color:
                    item.categoria?.color ?? '#9E9E9E',

                icono:
                    item.categoria?.icono ?? 'category',
            },

            total,
            porcentaje: Number(porcentaje.toFixed(2)),
            cantidad_movimientos: cantidadMovimientos,

            promedio_movimiento: Number(
                Number(item.promedio_movimiento ?? 0).toFixed(2),
            ),

            monto_minimo: Number(
                Number(item.monto_minimo ?? 0).toFixed(2),
            ),

            monto_maximo: Number(
                Number(item.monto_maximo ?? 0).toFixed(2),
            ),
        };
    });

    const categoriasIngreso = categorias.filter(
        (item) => item.tipo === 'INGRESO',
    );

    const categoriasEgreso = categorias.filter(
        (item) => item.tipo === 'EGRESO',
    );

    return {
        periodo,

        resumen: {
            total_ingresos: totalesPorTipo.INGRESO.total,
            total_egresos: totalesPorTipo.EGRESO.total,

            cantidad_ingresos:
                totalesPorTipo.INGRESO.cantidad,

            cantidad_egresos:
                totalesPorTipo.EGRESO.cantidad,

            saldo:
                totalesPorTipo.INGRESO.total -
                totalesPorTipo.EGRESO.total,

            cantidad_categorias_ingreso:
                categoriasIngreso.length,

            cantidad_categorias_egreso:
                categoriasEgreso.length,

            cantidad_categorias:
                categorias.length,
        },

        categorias,

        categorias_ingreso: categoriasIngreso,
        categorias_egreso: categoriasEgreso,
    };
};

module.exports = getReporteCategoriasService;
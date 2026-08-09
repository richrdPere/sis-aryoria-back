/**
 * Catálogo contable inicial de Aryoria.
 *
 * tipo:
 * - INGRESO
    * - EGRESO
    *
 * naturaleza:
 * - VENTA
    * - COMPRA
    * - OTRO
    */

const CATALOGO_INICIAL = [
    // ============================================================
    // INGRESOS
    // ============================================================

    {
        nombre: "Ventas",
        tipo: "INGRESO",
        naturaleza: "VENTA",
        descripcion: "Ingresos provenientes de ventas y cobros a clientes.",
        color: "#22C55E",
        icono: "shopping_cart",

        subcategorias: [
            {
                nombre: "Ventas al Contado",
                naturaleza: "VENTA",
                orden: 1,
            },
            {
                nombre: "Cobros a Clientes (Cuentas por Cobrar)",
                naturaleza: "VENTA",
                orden: 2,
            },
        ],
    },

    {
        nombre: "Financiamiento",
        tipo: "INGRESO",
        naturaleza: "OTRO",
        descripcion:
            "Ingresos provenientes de capital, préstamos o financiamiento.",
        color: "#3B82F6",
        icono: "account_balance",

        subcategorias: [
            {
                nombre: "Aportes de Capital / Préstamos Recibidos",
                naturaleza: "OTRO",
                orden: 1,
            },
        ],
    },

    {
        nombre: "Otros Ingresos",
        tipo: "INGRESO",
        naturaleza: "OTRO",
        descripcion:
            "Otros ingresos relacionados con la operación de la empresa.",
        color: "#06B6D4",
        icono: "payments",

        subcategorias: [
            {
                nombre: "Otros Ingresos Operativos",
                naturaleza: "OTRO",
                orden: 1,
            },
        ],
    },

    // ============================================================
    // EGRESOS
    // ============================================================

    {
        nombre: "Compras",
        tipo: "EGRESO",
        naturaleza: "COMPRA",
        descripcion:
            "Compras de mercancía, materia prima, equipos y activos.",
        color: "#EF4444",
        icono: "shopping_bag",

        subcategorias: [
            {
                nombre: "Compras de Mercancía / Materia Prima",
                naturaleza: "COMPRA",
                orden: 1,
            },
            {
                nombre: "Compra de equipos o maquinaria",
                naturaleza: "COMPRA",
                orden: 2,
            },
        ],
    },

    {
        nombre: "Gastos Operativos",
        tipo: "EGRESO",
        naturaleza: "OTRO",
        descripcion:
            "Gastos necesarios para el funcionamiento cotidiano de la empresa.",
        color: "#F97316",
        icono: "business",

        subcategorias: [
            {
                nombre: "Alquiler de Local / Oficinas",
                naturaleza: "OTRO",
                orden: 1,
            },
            {
                nombre:
                    "Servicios Públicos (Luz, Agua, Internet, Teléfono)",
                naturaleza: "OTRO",
                orden: 2,
            },
            {
                nombre: "Combustible y lubricantes",
                naturaleza: "OTRO",
                orden: 3,
            },
            {
                nombre:
                    "Mantenimiento de maquinaria y vehículos",
                naturaleza: "OTRO",
                orden: 4,
            },
            {
                nombre: "Otros Gastos Operativos",
                naturaleza: "OTRO",
                orden: 5,
            },
        ],
    },

    {
        nombre: "Personal",
        tipo: "EGRESO",
        naturaleza: "OTRO",
        descripcion:
            "Gastos relacionados con trabajadores, remuneraciones y cargas sociales.",
        color: "#8B5CF6",
        icono: "groups",

        subcategorias: [
            {
                nombre: "Sueldos, Salarios y Cargas Sociales",
                naturaleza: "OTRO",
                orden: 1,
            },
        ],
    },

    {
        nombre: "Marketing y Ventas",
        tipo: "EGRESO",
        naturaleza: "OTRO",
        descripcion:
            "Gastos relacionados con promoción, publicidad y comercialización.",
        color: "#EC4899",
        icono: "campaign",

        subcategorias: [
            {
                nombre: "Marketing, Publicidad y Ventas",
                naturaleza: "OTRO",
                orden: 1,
            },
            {
                nombre: "Gastos de ventas y comercialización",
                naturaleza: "OTRO",
                orden: 2,
            },
        ],
    },

    {
        nombre: "Impuestos",
        tipo: "EGRESO",
        naturaleza: "OTRO",
        descripcion:
            "Tributos, tasas y obligaciones fiscales de la empresa.",
        color: "#EAB308",
        icono: "receipt_long",

        subcategorias: [
            {
                nombre: "Impuestos y Tasas Municipales",
                naturaleza: "OTRO",
                orden: 1,
            },
        ],
    },

    {
        nombre: "Financiamiento",
        tipo: "EGRESO",
        naturaleza: "OTRO",
        descripcion:
            "Pagos relacionados con préstamos, intereses y amortizaciones.",
        color: "#64748B",
        icono: "account_balance_wallet",

        subcategorias: [
            {
                nombre:
                    "Pago de Intereses y Amortización de Deudas",
                naturaleza: "OTRO",
                orden: 1,
            },
        ],
    },

    {
        nombre: "Gastos Administrativos",
        tipo: "EGRESO",
        naturaleza: "OTRO",
        descripcion:
            "Gastos administrativos propios de la gestión empresarial.",
        color: "#78716C",
        icono: "admin_panel_settings",

        subcategorias: [
            {
                nombre: "Gastos administrativos",
                naturaleza: "OTRO",
                orden: 1,
            },
        ],
    },
];


module.exports = CATALOGO_INICIAL;
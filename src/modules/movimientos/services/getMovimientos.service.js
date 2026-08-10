const { Op } = require("sequelize");
const db = require("../../../database/models");

// Modelos
const {
  Movimiento,
  Categoria,
  Subcategoria,
  Empresa,
  Usuario,
  PeriodoContable,
  // Cuenta, // Descomenta si ya tienes esta relación definida
} = db;

const getMovimientos = async (query) => {
  let {
    page = 1,
    limit = 10,
    search = "",

    id_empresa,
    id_periodo,
    id_categoria,
    id_subcategoria,
    id_cuenta,

    tipo,
    estado,

    fecha_inicio,
    fecha_fin,
  } = query;

  // ==========================================================
  // NORMALIZAR PAGINACIÓN
  // ==========================================================
  page = Number(page);
  limit = Number(limit);

  if (Number.isNaN(page) || page < 1) {
    page = 1;
  }

  if (Number.isNaN(limit) || limit < 1) {
    limit = 10;
  }

  // Opcional para evitar consultas demasiado grandes
  if (limit > 100) {
    limit = 100;
  }

  // ==========================================================
  // VALIDACIONES
  // ==========================================================
  if (!id_empresa) {
    throw new Error(
      "El id_empresa es obligatorio para listar movimientos."
    );
  }

  const offset = (page - 1) * limit;

  // ==========================================================
  // FILTROS
  // ==========================================================
  const where = {
    id_empresa,
    activo: true,
  };

  if (id_periodo) {
    where.id_periodo = id_periodo;
  }

  if (id_categoria) {
    where.id_categoria = id_categoria;
  }

  if (id_subcategoria) {
    where.id_subcategoria = id_subcategoria;
  }

  if (id_cuenta) {
    where.id_cuenta = id_cuenta;
  }

  if (tipo) {
    const tipoNormalizado = tipo
      .toString()
      .trim()
      .toUpperCase();

    if (!["INGRESO", "EGRESO"].includes(tipoNormalizado)) {
      throw new Error(
        "El tipo debe ser INGRESO o EGRESO."
      );
    }

    where.tipo = tipoNormalizado;
  }

  if (estado) {
    const estadoNormalizado = estado
      .toString()
      .trim()
      .toUpperCase();

    if (
      !["PENDIENTE", "PAGADO", "ANULADO"].includes(
        estadoNormalizado
      )
    ) {
      throw new Error(
        "El estado debe ser PENDIENTE, PAGADO o ANULADO."
      );
    }

    where.estado = estadoNormalizado;
  }

  // ==========================================================
  // RANGO DE FECHAS
  // ==========================================================
  if (fecha_inicio && fecha_fin) {
    where.fecha = {
      [Op.between]: [
        fecha_inicio,
        fecha_fin,
      ],
    };
  } else if (fecha_inicio) {
    where.fecha = {
      [Op.gte]: fecha_inicio,
    };
  } else if (fecha_fin) {
    where.fecha = {
      [Op.lte]: fecha_fin,
    };
  }

  // ==========================================================
  // BÚSQUEDA
  // ==========================================================
  const searchText = search
    ?.toString()
    .trim();

  if (searchText) {
    where[Op.or] = [
      {
        descripcion: {
          [Op.like]: `%${searchText}%`,
        },
      },
      {
        observacion: {
          [Op.like]: `%${searchText}%`,
        },
      },
      {
        comprobante: {
          [Op.like]: `%${searchText}%`,
        },
      },
    ];
  }

  // ==========================================================
  // CONSULTA
  // ==========================================================
  const { count, rows } =
    await Movimiento.findAndCountAll({
      where,

      include: [
        {
          model: Empresa,
          as: "empresa",
          attributes: [
            "id_empresa",
            "razon_social",
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
        // Si ya tienes el modelo Cuenta asociado:
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

      order: [
        ["fecha", "DESC"],
        ["created_at", "DESC"],
      ],

      offset,
      limit,

      distinct: true,
    });

  // ==========================================================
  // RESPUESTA
  // ==========================================================
  return {
    items: rows,

    pagination: {
      total: count,
      page,
      limit,
      totalPages: count === 0
        ? 0
        : Math.ceil(count / limit),
      hasNextPage: page < Math.ceil(count / limit),
      hasPreviousPage: page > 1,
    },
  };
};

module.exports = getMovimientos;
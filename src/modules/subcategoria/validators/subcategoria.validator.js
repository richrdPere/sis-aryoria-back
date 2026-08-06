const { Op } = require("sequelize");

const db = require("../../../database/models");

// Modelos
const { Subcategoria, Categoria, Empresa } = db;


/**
 * 1. Normaliza un texto eliminando espacios innecesarios.
 */
const normalizarTexto = (value) => {
    if (typeof value !== "string") {
        return value;
    }

    return value.trim();
};

/**
 * 2. Convierte un valor a número entero positivo.
 */
const normalizarId = (value) => {
    const parsed = Number(value);

    return Number.isInteger(parsed) && parsed > 0
        ? parsed
        : null;
};

/**
 * 3. Obtiene una empresa activa.
 */
const obtenerEmpresaActiva = async (
    idEmpresa,
    transaction = null
) => {
    const empresa = await Empresa.findOne({
        where: {
            id_empresa: idEmpresa,
            estado: true,
        },
        transaction,
    });

    if (!empresa) {
        throw new Error(
            "La empresa no existe o se encuentra inactiva."
        );
    }

    return empresa;
};

/**
 * 4. Obtiene una categoría activa perteneciente a la empresa.
 */
const obtenerCategoriaActiva = async ({
    idEmpresa,
    idCategoria,
    transaction = null,
}) => {
    const categoria = await Categoria.findOne({
        where: {
            id_categoria: idCategoria,
            id_empresa: idEmpresa,
            estado: true,
        },
        transaction,
    });

    if (!categoria) {
        throw new Error(
            "La categoría no existe, está inactiva o no pertenece a la empresa."
        );
    }

    return categoria;
};

/**
 * 5. Verifica que no exista otra subcategoría con el mismo nombre
 * dentro de la misma categoría.
 */
const validarNombreDuplicado = async ({
    idCategoria,
    nombre,
    idSubcategoriaExcluir = null,
    transaction = null,
}) => {
    const where = {
        id_categoria: idCategoria,
        nombre: {
            [Op.eq]: nombre,
        },
    };

    if (idSubcategoriaExcluir) {
        where.id_subcategoria = {
            [Op.ne]: idSubcategoriaExcluir,
        };
    }

    const subcategoriaExistente =
        await Subcategoria.findOne({
            where,
            paranoid: false,
            transaction,
        });

    if (!subcategoriaExistente) {
        return;
    }

    if (subcategoriaExistente.deleted_at) {
        throw new Error(
            "Ya existe una subcategoría eliminada con ese nombre. Debe restaurarla o utilizar otro nombre."
        );
    }

    throw new Error(
        "Ya existe una subcategoría con ese nombre dentro de la categoría seleccionada."
    );
};

/**
 * 6. Obtiene el ID de empresa desde la sesión.
 */
const obtenerIdEmpresa = (req) => {
    const idEmpresa =
        req.usuario?.id_empresa ||
        req.usuario?.empresa?.id_empresa ||
        req.empresa?.id_empresa ||
        req.body?.id_empresa ||
        req.query?.id_empresa;

    const parsed = Number(idEmpresa);

    if (
        !Number.isInteger(parsed) ||
        parsed <= 0
    ) {
        throw new Error(
            "No se pudo determinar la empresa activa."
        );
    }

    return parsed;
};

/**
 * 7. Convierte un valor a booleano.
 */
const convertirBooleano = (valor, valorPorDefecto = false) => {
    if (valor === undefined || valor === null) {
        return valorPorDefecto;
    }

    return (
        valor === true ||
        valor === "true" ||
        valor === 1 ||
        valor === "1"
    );
};



module.exports = {
    convertirBooleano,
    normalizarId,
    normalizarTexto,
    obtenerCategoriaActiva,
    obtenerEmpresaActiva,
    obtenerIdEmpresa,
    validarNombreDuplicado,
}

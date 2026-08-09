const { Op } = require("sequelize");

const db = require("../../../database/models");

// Modelos
const { Subcategoria, Categoria, Empresa } = db;

// Validadores
const {
    normalizarTexto,
    normalizarId,
    obtenerEmpresaActiva,
    obtenerCategoriaActiva,
    validarNombreDuplicado,
} = require("../validators/subcategoria.validator");

// Service
const getSubcategoriaByIdService = require("./getSubcategoriaById.service");

const updateSubcategoriaService = async ({
    idEmpresa,
    idSubcategoria,
    body,
}) => {

    await db.sequelize.transaction(
        async (transaction) => {

            const subcategoria =
                await Subcategoria.findOne({
                    where: {
                        id_subcategoria:
                            idSubcategoria,
                        id_empresa:
                            idEmpresa,
                    },
                    transaction,
                });

            if (!subcategoria) {
                throw new Error(
                    "La subcategoría no existe o no pertenece a la empresa."
                );
            }

            const idCategoria =
                body.id_categoria !== undefined
                    ? normalizarId(
                        body.id_categoria
                    )
                    : Number(
                        subcategoria.id_categoria
                    );

            if (!idCategoria) {
                throw new Error(
                    "La categoría es obligatoria."
                );
            }

            await obtenerCategoriaActiva({
                idEmpresa,
                idCategoria,
                transaction,
            });

            const nombre =
                body.nombre !== undefined
                    ? normalizarTexto(
                        body.nombre
                    )
                    : subcategoria.nombre;

            if (!nombre) {
                throw new Error(
                    "El nombre de la subcategoría es obligatorio."
                );
            }

            await validarNombreDuplicado({
                idCategoria,
                nombre,
                idSubcategoriaExcluir:
                    idSubcategoria,
                transaction,
            });

            const datosActualizar = {
                id_categoria:
                    idCategoria,
                nombre,
            };

            if (
                body.descripcion !==
                undefined
            ) {
                datosActualizar.descripcion =
                    normalizarTexto(
                        body.descripcion
                    ) || null;
            }

            if (
                body.es_predeterminada !==
                undefined
            ) {
                datosActualizar.es_predeterminada =
                    body.es_predeterminada ===
                    true ||
                    body.es_predeterminada ===
                    "true" ||
                    body.es_predeterminada ===
                    1 ||
                    body.es_predeterminada ===
                    "1";
            }

            if (body.orden !== undefined) {

                const orden =
                    Number.parseInt(
                        body.orden,
                        10
                    );

                if (
                    Number.isNaN(orden) ||
                    orden < 0
                ) {
                    throw new Error(
                        "El orden debe ser un número entero igual o mayor a cero."
                    );
                }

                datosActualizar.orden =
                    orden;
            }

            if (body.estado !== undefined) {

                datosActualizar.estado =
                    body.estado === true ||
                    body.estado === "true" ||
                    body.estado === 1 ||
                    body.estado === "1";
            }

            await subcategoria.update(
                datosActualizar,
                {
                    transaction,
                }
            );
        }
    );

    return await getSubcategoriaByIdService({
        idEmpresa,
        idSubcategoria,
    });
};

module.exports = updateSubcategoriaService;
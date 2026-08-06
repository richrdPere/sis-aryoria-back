const { Op } = require("sequelize");

const db = require("../../../database/models");


// Service
const getSubcategoriaByIdService = require("./getSubcategoriaById.service");

// Modelos
const { Subcategoria, Categoria, Empresa, sequelize } = db;

// Validadores
const {
    normalizarTexto,
    normalizarId,
    obtenerEmpresaActiva,
    obtenerCategoriaActiva,
    validarNombreDuplicado,
    convertirBooleano
} = require("../validators/subcategoria.validator");

// Service
const createSubcategoriaService = async ({
    idEmpresa,
    body,
}) => {
    const idSubcategoria = await sequelize.transaction(
        async (transaction) => {
            await obtenerEmpresaActiva(
                idEmpresa,
                transaction
            );

            const idCategoria = normalizarId(
                body.id_categoria
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

            const nombre = normalizarTexto(
                body.nombre
            );

            if (!nombre) {
                throw new Error(
                    "El nombre de la subcategoría es obligatorio."
                );
            }

            await validarNombreDuplicado({
                idCategoria,
                nombre,
                transaction,
            });

            const orden =
                body.orden === undefined ||
                    body.orden === null ||
                    body.orden === ""
                    ? 0
                    : Number.parseInt(body.orden, 10);

            if (
                !Number.isInteger(orden) ||
                orden < 0
            ) {
                throw new Error(
                    "El orden debe ser un número entero igual o mayor a cero."
                );
            }

            const subcategoria =
                await Subcategoria.create(
                    {
                        id_empresa: idEmpresa,
                        id_categoria: idCategoria,
                        nombre,
                        descripcion:
                            normalizarTexto(
                                body.descripcion
                            ) || null,
                        es_predeterminada:
                            convertirBooleano(
                                body.es_predeterminada,
                                false
                            ),
                        orden,
                        estado:
                            convertirBooleano(
                                body.estado,
                                true
                            ),
                    },
                    {
                        transaction,
                    }
                );

            return subcategoria.id_subcategoria;
        }
    );

    // Esta consulta se ejecuta después de que la transacción terminó correctamente.
    return getSubcategoriaByIdService({
        idEmpresa,
        idSubcategoria,
    });
};


module.exports = createSubcategoriaService;
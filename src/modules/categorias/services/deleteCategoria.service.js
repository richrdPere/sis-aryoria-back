const db = require("../../../database/models");

// Modelos
const { Categoria } = db;

const deleteCategoria = async (id_categoria) => {

    const categoria = await Categoria.findByPk(id_categoria);

    if (!categoria) {
        throw new Error("La categoría no existe.");
    }

    await categoria.destroy();

    return true;

};

module.exports = deleteCategoria;
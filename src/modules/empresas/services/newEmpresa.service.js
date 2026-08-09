const db = require("../../../database/models");

// Utils
const CATALOGO_INICIAL = require("../utils/catalogo.utils");

// Modelos
const {
  Usuario,
  Empresa,
  Categoria,
  Subcategoria,
  sequelize,
} = db;

// SERVICE
const crearEmpresa = async (data) => {
  const {
    id_usuario,
    razon_social,
    nombre_comercial,
    ruc,
    tipo_empresa,
    direccion_fiscal,
    telefono,
    email,
    pagina_web,
    logo_url,
    estado,
    activo_sunat,
  } = data;

  return await sequelize.transaction(
    async (transaction) => {

      // ==========================================================
      // 1. VERIFICAR USUARIO
      // ==========================================================
      const usuario = await Usuario.findByPk(
        id_usuario,
        {
          transaction,
        }
      );

      if (!usuario) {
        throw new Error(
          "El usuario no existe."
        );
      }

      // ==========================================================
      // 2. VERIFICAR RUC DUPLICADO
      // ==========================================================
      const empresaExistente =
        await Empresa.findOne({
          where: {
            ruc,
          },
          transaction,
        });

      if (empresaExistente) {
        throw new Error(
          "Ya existe una empresa registrada con ese RUC."
        );
      }

      // ==========================================================
      // 3. CREAR EMPRESA
      // ==========================================================
      const empresa = await Empresa.create(
        {
          id_usuario,
          razon_social,
          nombre_comercial,
          ruc,
          tipo_empresa,
          direccion_fiscal,
          telefono,
          email,
          pagina_web,
          logo_url,
          estado,
          activo_sunat,
        },
        {
          transaction,
        }
      );

      // ==========================================================
      // 4. CREAR CATÁLOGO CONTABLE PREDETERMINADO
      // ==========================================================
      for (
        const categoriaData of CATALOGO_INICIAL
      ) {

        // --------------------------------------------------------
        // Crear categoría
        // --------------------------------------------------------
        const categoria =
          await Categoria.create(
            {
              id_empresa: empresa.id_empresa,
              nombre: categoriaData.nombre,
              tipo: categoriaData.tipo,
              naturaleza: categoriaData.naturaleza,
              descripcion: categoriaData.descripcion,
              color: categoriaData.color,
              icono: categoriaData.icono,
              estado: true,
            },
            {
              transaction,
            }
          );

        // --------------------------------------------------------
        // Crear subcategorías
        // --------------------------------------------------------
        for (const subcategoriaData of categoriaData.subcategorias) {
          await Subcategoria.create(
            {
              id_empresa: empresa.id_empresa,
              id_categoria: categoria.id_categoria,
              nombre: subcategoriaData.nombre,
              descripcion: null,
              naturaleza: subcategoriaData.naturaleza,
              es_predeterminada: true,
              orden: subcategoriaData.orden,
              estado: true,
            },
            {
              transaction,
            }
          );
        }
      }

      // ==========================================================
      // 5. RETORNAR EMPRESA
      // ==========================================================
      return empresa;
    }
  );
};

module.exports = crearEmpresa;

// const db = require("../../../database/models");

// // Modelos
// const {
//   Categoria,
//   Empresa,
//   Subcategoria,
//   Usuario,
//   sequelize,
// } = db;


// const crearEmpresa = async (data) => {
//   const {
//     id_usuario,
//     razon_social,
//     nombre_comercial,
//     ruc,
//     tipo_empresa,
//     direccion_fiscal,
//     telefono,
//     email,
//     pagina_web,
//     logo_url,
//     estado,
//     activo_sunat,
//   } = data;

//   // Verificar que exista el usuario
//   const usuario = await Usuario.findByPk(id_usuario);

//   if (!usuario) {
//     throw new Error("El usuario no existe.");
//   }

//   // Verificar RUC duplicado
//   const empresaExistente = await Empresa.findOne({
//     where: {
//       ruc,
//     },
//   });

//   if (empresaExistente) {
//     throw new Error("Ya existe una empresa registrada con ese RUC.");
//   }

//   const empresa = await Empresa.create({
//     id_usuario,
//     razon_social,
//     nombre_comercial,
//     ruc,
//     tipo_empresa,
//     direccion_fiscal,
//     telefono,
//     email,
//     pagina_web,
//     logo_url,
//     estado,
//     activo_sunat,
//   });

//   return empresa;
// };

// module.exports = crearEmpresa;
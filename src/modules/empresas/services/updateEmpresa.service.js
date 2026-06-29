const { Op } = require("sequelize");
const db = require("../../../database/models");

// Modelo
const { Empresa } = db


const actualizarEmpresa = async (id_empresa, data) => {
  const empresa = await Empresa.findByPk(id_empresa);

  if (!empresa) {
    throw new Error("La empresa no existe.");
  }

  // Validar RUC único
  if (data.ruc) {
    const existeRuc = await Empresa.findOne({
      where: {
        ruc: data.ruc,
        id_empresa: {
          [Op.ne]: id_empresa,
        },
      },
    });

    if (existeRuc) {
      throw new Error("El RUC ya se encuentra registrado.");
    }
  }

  const camposActualizar = {
    razon_social: data.razon_social,
    nombre_comercial: data.nombre_comercial,
    ruc: data.ruc,
    tipo_empresa: data.tipo_empresa,
    direccion_fiscal: data.direccion_fiscal,
    telefono: data.telefono,
    email: data.email,
    pagina_web: data.pagina_web,
    logo_url: data.logo_url,
    estado: data.estado,
    activo_sunat: data.activo_sunat,
  };

  Object.keys(camposActualizar).forEach((key) => {
    if (camposActualizar[key] === undefined) {
      delete camposActualizar[key];
    }
  });

  await empresa.update(camposActualizar);

  return empresa;
};

module.exports = actualizarEmpresa
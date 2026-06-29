const db = require("../../../database/models");

// Modelos 
const { Usuario, Empresa } = db;


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

  // Verificar que exista el usuario
  const usuario = await Usuario.findByPk(id_usuario);

  if (!usuario) {
    throw new Error("El usuario no existe.");
  }

  // Verificar RUC duplicado
  const empresaExistente = await Empresa.findOne({
    where: {
      ruc,
    },
  });

  if (empresaExistente) {
    throw new Error("Ya existe una empresa registrada con ese RUC.");
  }

  const empresa = await Empresa.create({
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
  });

  return empresa;
};

module.exports = crearEmpresa;
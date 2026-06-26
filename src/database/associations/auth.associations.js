// auth.associations.js

module.exports = (db) => {

  // Persona - Usuario
  db.Persona.hasOne(db.Usuario, {
    foreignKey: "id_persona",
    as: "usuario",
  });

  db.Usuario.belongsTo(db.Persona, {
    foreignKey: "id_persona",
    as: "persona",
  });

  // Usuario - Rol (N:M)
  db.Usuario.belongsToMany(db.Roles, {
    through: db.UsuarioRol,
    foreignKey: "id_usuario",
    otherKey: "id_rol",
    as: "roles",
  });

  db.Roles.belongsToMany(db.Usuario, {
    through: db.UsuarioRol,
    foreignKey: "id_rol",
    otherKey: "id_usuario",
    as: "usuarios",
  });

};
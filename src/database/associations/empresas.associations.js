module.exports = (db) => {

  /**
   * Un usuario puede crear muchas empresas
   */
  db.Usuario.hasMany(db.Empresa, {
    foreignKey: "id_usuario",
    as: "empresas",
  });

  /**
   * Una empresa pertenece al usuario creador
   */
  db.Empresa.belongsTo(db.Usuario, {
    foreignKey: "id_usuario",
    as: "usuario",
  });

};
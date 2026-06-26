// auth.associations.js

module.exports = (db) => {

  db.Usuario.belongsTo(db.Persona, {
    foreignKey: "id_persona",
  });

  db.Persona.hasOne(db.Usuario, {
    foreignKey: "id_persona",
  });

};
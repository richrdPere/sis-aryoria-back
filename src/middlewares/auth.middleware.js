const jwt = require("jsonwebtoken");

/**
 * Middleware que verifica la validez del token JWT.
 * Si es válido, agrega la información del usuario (req.usuario)
 * para que los controladores sepan quién hace la petición.
 */
const verificarToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No se proporcionó un token" });
  }

  try {
    const tokenSinBearer = token.startsWith("Bearer ") ? token.slice(7) : token;
    const decoded = jwt.verify(tokenSinBearer, process.env.JWT_SECRET);
    req.usuario = decoded; // Guardamos info del usuario
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

module.exports = verificarToken;

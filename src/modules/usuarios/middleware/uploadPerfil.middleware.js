const multer = require("multer");

// ==========================================================
// ALMACENAMIENTO EN MEMORIA
// ==========================================================
const storage = multer.memoryStorage();

// ==========================================================
// TIPOS PERMITIDOS
// ==========================================================
const fileFilter = (req, file, cb) => {
    // console.log(
    //     `Archivo recibido: ${file.originalname} | ${file.mimetype}`
    // );

    const tiposPermitidos = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/octet-stream",
    ];

    if (!tiposPermitidos.includes(file.mimetype)) {
        return cb(
            new Error(
                `Formato de imagen no permitido (${file.mimetype}). ` +
                "Solo se permiten JPG, PNG o WEBP."
            )
        );
    }

    cb(null, true);
};

// ==========================================================
// MULTER
// ==========================================================
const uploadPerfilFoto = multer({
    storage,

    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1,
    },

    fileFilter,
});

module.exports = uploadPerfilFoto;
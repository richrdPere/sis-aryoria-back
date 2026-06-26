const authService =
  require("../services/auth.service");

const login = async (
  req,
  res
) => {
  try {
    const result =
      await authService.login(
        req.body
      );

    res.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
};

module.exports = {
  login,
};
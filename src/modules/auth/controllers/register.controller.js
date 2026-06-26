const registerService = require("../services/register.service");

const register = async (req, res) => {
  try {
    const user = await registerService.register(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const User = require("../models/User");

const getUserInfo = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    res.json({
      user,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = {
  getUserInfo,
};

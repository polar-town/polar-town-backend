const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const User = require("../models/User");

const handleLogin = async (req, res, next) => {
  const { name, email, photo } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      const newUser = {
        name,
        email,
        photo,
      };

      user = await User.create(newUser);
    }

    const accessToken = jwt.sign(
      { email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: Number(process.env.ACCESS_TOKEN_MAX_AGE) }
    );

    const refreshToken = jwt.sign(
      { email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: Number(process.env.REFRESH_TOKEN_MAX_AGE) }
    );

    await user.updateOne({ photo });

    res.json({
      result: { accessToken, refreshToken, user },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const handleRefreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  try {
    jwt.verify(
      refreshToken,
      process.env.ACCESS_TOKEN_SECRET,
      async (error, decoded) => {
        if (error?.name === "TokenExpiredError") {
          return next(createError(401, "Unauthorized"));
        }

        if (!decoded) return next(createError(403, "Forbidden"));

        const user = await User.findOne({ email: decoded.email });

        if (error || !user) return next(createError(403, "Forbidden"));

        const accessToken = jwt.sign(
          { email: decoded.email },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: Number(process.env.REFRESH_TOKEN_MAX_AGE) }
        );

        res.json({
          result: { accessToken, user },
        });
      }
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  handleLogin,
  handleRefreshToken,
};

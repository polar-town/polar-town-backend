const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const User = require("../models/User");

const handleLogin = async (req, res, next) => {
  const { name, email } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      const newUser = {
        name,
        email,
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

    await user.updateOne({ refreshToken });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE),
    });

    res.json({
      result: {
        id: user._id,
        accessToken,
        username: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const handleLogout = async (req, res, next) => {
  const { email } = req.body;

  try {
    await User.findOneAndUpdate({ email }, { $set: { refreshToken: null } });
  } catch (error) {
    console.error(error);
    next(error);
  }

  const cookies = req.cookies;
  const refreshToken = cookies.jwt;

  if (!refreshToken) return res.json({ result: "ok" });

  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });

  res.json({ result: "ok" });
};

const handleRefreshToken = async (req, res, next) => {
  const cookies = req.cookies;
  const refreshToken = cookies.jwt;

  if (!refreshToken) return next(createError(401, "Unauthorized"));

  try {
    const user = await User.findOne({ refreshToken });
    if (!user) return next(createError(403, "Forbidden"));

    jwt.verify(
      refreshToken,
      process.env.ACCESS_TOKEN_SECRET,
      (error, decoded) => {
        if (error || decoded.email !== user.email)
          return next(createError(403, "Forbidden"));
        const accessToken = jwt.sign(
          { email: decoded.email },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: Number(process.env.REFRESH_TOKEN_MAX_AGE) }
        );

        res.json({ accessToken, username: user.name, email: user.email });
      }
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  handleLogin,
  handleLogout,
  handleRefreshToken,
};

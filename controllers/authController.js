const jwt = require("jsonwebtoken");
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
      {
        UserInfo: {
          email: user.email,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      {
        email: user.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    await user.updateOne({ refreshToken });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken, username: user.name, email: user.email });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const handleLogout = async (req, res, next) => {
  const cookies = req.cookies;
  const refreshToken = cookies.jwt;

  if (!refreshToken) return res.send({ result: "ok" });

  try {
    const user = await User.findOne({ refreshToken });

    if (user) {
      await user.updateOne({ refreshToken: null });
    }

    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.send({ result: "ok" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = { handleLogin, handleLogout };

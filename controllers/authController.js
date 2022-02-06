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

module.exports = { handleLogin };

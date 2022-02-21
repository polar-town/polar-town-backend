const jwt = require("jsonwebtoken");
const request = require("supertest");
const { expect } = require("chai");
const app = require("../app");

describe("user controller", () => {
  const testUser = {
    name: "김북극곰",
    email: "polartown2022@gmail.com",
    photo:
      "https://lh3.googleusercontent.com/a/AATXAJxyWykVhXpnc5Ki8zTk-9rDO3r5QCdxsYDwhr0m=s96-c",
  };
  let refreshToken;
  let accessToken;

  describe("POST auth/login", function () {
    it("should respond with access token, refresh token, userInfo if requests login", (done) => {
      request(app)
        .post("/auth/login")
        .send(testUser)
        .expect("Content-Type", /json/)
        .expect(200)
        .end(async (err, res) => {
          if (err) return done(err);

          accessToken = res.body.result.accessToken;
          refreshToken = res.body.result.refreshToken;
          const user = res.body.result.user;
          const decodedAccessToken = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
          );
          const decodedRefreshToken = jwt.verify(
            refreshToken,
            process.env.ACCESS_TOKEN_SECRET
          );

          expect(user.email).to.eql(testUser.email);
          expect(user.name).to.eql(testUser.name);
          expect(user.photo).to.eql(testUser.photo);
          expect(user.email).to.eql(decodedAccessToken.email);
          expect(decodedAccessToken.exp - decodedAccessToken.iat).to.eql(
            Number(process.env.ACCESS_TOKEN_MAX_AGE)
          );
          expect(decodedRefreshToken.exp - decodedRefreshToken.iat).to.eql(
            Number(process.env.REFRESH_TOKEN_MAX_AGE)
          );
          done();
        });
    });
  });
});

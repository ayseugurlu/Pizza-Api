"use strict";

const User = require("../models/user");
const Token = require("../models/token");
const passwordEncrypt = require("../helpers/passwordEncrypt");

module.exports = {
  login: async (req, res) => {
    /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Login"
            #swagger.description = 'Login with username (or email) and password for get simpleToken and JWT'
            #swagger.parameters["body"] = {
                in: "body",
                required: true,
                schema: {
                    "username": "test",
                    "password": "aA?123456",
                }
            }
        */

    const { email, userName, password } = req.body;

    if (!((userName || email) && password)) {
      res.errorStatusCode = 401;
      throw new Error("UserName/Email and Password required!");
    }

    const user = await User.findOne({ $or: [{ userName }, { email }] });

    if (user?.password !== passwordEncrypt(password)) {
      res.errorStatusCode = 401;
      throw new Error("Incorrect username/email or password.");
    }

    if (!user.isActive) {
      res.errorStatusCode = 401;
      throw new Error("This account is not active.");
    }

    //* Simple Token

    let tokenData = await Token.findOne({ userId: user._id });

    if (!tokenData) {
      {
        tokenData = await Token.create({
          userId: user._id,
          token: passwordEncrypt(user._id + Date.now()),
        });
      }
    }
    //*--------------------------------------------------------

    //* JWT

    //AccessToken
    const accessData = {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      isActive: user.isActive,
      isAdmin: user.isAdmin,
    };

    //Convert to JWT
    // jwt.sign(payload, key, { expireIn: 3m })
    const accessToken = jwt.sign(accessData, process.env.ACCESS_KEY, {
      expiresIn: "30m",
    });

    //RefreshToken:
    const refreshData = {
      _id: user._id,
      password: user.password,
    };

    //Convert to JWT
    const refreshToken = jwt.sign(refreshData, process.env.REFRESH_KEY, {
      expiresIn: "1d",
    });

    //*------------------------------------------------------------------------------------

    res.send({
      error: false,
      token: tokenData.token,
      bearer: {
        access: accessToken,
        refresh: refreshToken,
      },
      user,
    });
  },
  refresh: async (req, res) => {
    /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Refresh"
            #swagger.description = 'Refresh with refreshToken for get accessToken'
            #swagger.parameters["body"] = {
                in: "body",
                required: true,
                schema: {
                    "bearer": {
                        refresh: '...refresh_token...'
                    }
                }
            }
        */

    const refreshToken = req.body?.bearer?.refresh; //yukarda yazdik icinde id ve password var

    if (!refreshToken) {
      res.errorStatusCode = 401;
      throw new Error("Please enter bearer.refresh");
    }

    const refreshData = await jwt.verify(refreshToken, process.env.REFRESH_KEY);

    if (!refreshData) {
      res.errorStatusCode = 401;
      throw new Error("JWT refresh Token is wrong.");
    }

    const user = await User.findOne({ _id: refreshData._id });

    if (!(user && user.password == refreshData.password)) {
      res.errorStatusCode = 401;
      throw new Error("Wrong id or password.");
    }

    if (!user.isActive) {
      res.errorStatusCode = 401;
      throw new Error("This account is not active.");
    }

    res.status(200).send({
      error: false,
      bearer: {
        access: jwt.sign(user.toJSON(), process.env.ACCESS_KEY, {
          expiresIn: "30m",
        }),
      },
    });
  },
  logout: async (req, res) => {
    /*
            #swagger.tags = ["Tokens"]
            #swagger.summary = "Create Token"
        */

    const auth = req.headers?.authorization; // Token ...tokenkey...
    const tokenKey = auth ? auth.split(" ") : null; // ["Token", "tokenKey"]

    if (tokenKey[0] == "Token") {
      const result = await Token.deleteOne({ token: tokenKey[1] });

      res.send({
        error: false,
        message: "Logged out successfully",
        result,
      });
    } else if (tokenKey[0] == "Bearer") {
      res.send({
        error: false,
        message: "JWT : No need any process for logout. You can delete Tokens.",
      });
    }
  },
};

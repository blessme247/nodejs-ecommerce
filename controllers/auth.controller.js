import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/User.js";
import Role from "../model/Role.js";
import { handleError } from "../utils/handleError.js";
import { validationResult } from "express-validator";
import mongoose from "mongoose";

const handleLogin = async (req, res) => {
    const errors = validationResult(req)
  
    if (!errors.isEmpty()) {
      return handleError(req, res, 400, {
         message: errors.array()[0].msg,
          page: "auth/signin",
          pageTitle: "Log In",
          errors: errors.array(),
          formValues: req.body,
      })
    }
  try {
    const { user, password } = req.body;

    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser) return handleError(req, res, 401, { message: "Unauthorized", page: "signin", formValues: req.body }); //Unauthorized
    const userRole = await Role.findById(foundUser.roleId).exec();

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) return handleError(req, res, 401, { message: "Unauthorized", page: "signin", formValues: req.body });

    const role = userRole.code;

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          role: role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30m" },
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" },
    );

    await User.findOneAndUpdate({ username: user }, { refreshToken }).exec();
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    if(!req.accepts("json")){
        res.cookie("accessToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge:  30 * 60 * 1000,
    });
    }
    return res.status(200).json({ accessToken });
  } catch (error) {
    return handleError(
      req,
      res,
      500,
      { message: error?.message || "Internal server error", page: "signin" },
    );
  }
};

export default handleLogin;

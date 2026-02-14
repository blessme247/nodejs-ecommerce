import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/User.js";
import Role from "../model/Role.js";
import { handleError } from "../utils/handleError.js";
import { validationResult } from "express-validator";
import mongoose from "mongoose";

const handleRegister = async (req, res) => {
  const roles = await Role.find(
    { name: { $not: { $regex: /^admin$/i } } },
    { name: 1, _id: 1 },
  ).exec();

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return handleError(req, res, 400, {
       message: errors.array()[0].msg,
        page: "auth/signup",
        pageTitle: "Sign Up",
        errors: errors.array(),
        data: roles,
        formValues: req.body,
    })
  }
  try {
    const { firstName, lastName, email, password, roleId } = req.body;

    const duplicate = await User.findOne({ email }).exec();
    if (duplicate)
      return handleError(req, res, 409, {
        message: "Email already exists",
        page: "auth/signup",
        pageTitle: "Sign Up",
        data: roles,
        formValues: req.body,
      });

    let role;
    if (!roleId) {
      role = await Role.findOne({ name: "Buyer" }).exec();
    } else {
      role = await Role.findById(roleId).exec();
    }
    const username = email.split("@")[0];
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      roleId: role._id,
      username: username,
    });

     await user.save();
    // console.log(result, 'result')
    // const message = `New user ${result.username} created!`;
    // return handleSuccess(req, res, 201, {
    //   // message,
    //   pageTitle: "Sign In",
    //   path: "auth/signin",
    //   errors: {},
    //   errorMessage: "",
    // });
    res.redirect("/login")
  } catch (error) {
    console.log(error, "error");
    if (error instanceof mongoose.Error) {
      return handleError(req, res, 400, {
        errors: error.errors,
        page: "auth/signup",
        pageTitle: "Sign Up",
        data: roles,
        formValues: req.body,
      });
    }
    return handleError(req, res, 500, {
      message: error?.message || "Internal server error",
      page: "auth/signup",
      pageTitle: "Sign Up",
      data: roles,
      formValues: req.body,
    });
  }
};

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
    const { email, password } = req.body;

    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) return handleError(req, res, 401, { message: "Unauthorized", page: "auth/signin", formValues: req.body }); //Unauthorized
    const userRole = await Role.findById(foundUser.roleId).exec();

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) return handleError(req, res, 401, { message: "Unauthorized", page: "auth/signin", formValues: req.body });

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

    // await User.findOneAndUpdate({ email: foundUser.email }, { refreshToken }).exec();
    const user = new User({
      ...foundUser.toObject(),
      refreshToken
    })
    await user.save();
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
      { message: error?.message || "Internal server error", page: "auth/signin" },
    );
  }
};

const getLoginPage = async (req, res)=> {
  res.render('auth/signin', {
    pageTitle: "Log In",
    path: "signin",
    validationErrors: [],
    errorMessage: "",
    formValues: {}
  })
}

const getSignupPage = async (req, res)=> {
  // console.log(req.accepts(), 'accept heeaders')
  const roles = await Role.find(
        { name: { $not: { $regex: /^admin$/i } } },
        { name: 1, _id: 1 },
      ).exec();
  res.render('auth/signup', {
    pageTitle: "Sign Up",
    path: "signup",
    validationErrors: [],
    errorMessage: "",
    data: roles,
    formValues: {}
  })
}

export { handleRegister, handleLogin, getLoginPage, getSignupPage };

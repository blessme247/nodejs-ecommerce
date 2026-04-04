import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/User.js";
import Role from "../model/Role.js";
import { handleError } from "../utils/handleError.js";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import Seller from "../model/Seller.js";
import Buyer from "../model/Buyer.js";
import Cart from "../model/Cart.js";
// import { handleSuccess } from "../utils/handleSuccess.js";

const handleRegister = async (req, res) => {
  const roles = await Role.find(
    { name: { $not: { $regex: /^admin$/i } } },
    { name: 1, _id: 1 },
  ).exec();

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return handleError(req, res, 400, {
      message: errors.array()[0].msg,
      filePath: "auth/signup",
      pageTitle: "Sign Up",
      errors: errors.array(),
      data: roles,
      formValues: req.body,
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { firstName, lastName, email, password, roleId } = req.body;

    const duplicate = await User.findOne({ email }).session(session);
    if (duplicate){
      session.abortTransaction()
      return handleError(req, res, 409, {
        message: "Email already exists",
        filePath: "auth/signup",
        pageTitle: "Sign Up",
        data: roles,
        formValues: req.body,
      });
    }

    let role;
    if (!roleId) {
      role = await Role.findOne({ name: "Buyer" }).exec();
    } else {
      role = await Role.findById(roleId).exec();
    }
    const username = email.split("@")[0];
    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email.trim(),
      password: hashedPassword,
      roleId: role._id,
      username: username,
    });

    await user.save({ session });

    if (role.name == "Buyer") {
      const buyer = new Buyer({
        userId: user._id,
        email: user.email,
      });
      await buyer.save({ session });
    }
    if (role.name == "Seller") {
      const seller = new Seller({
        userId: user._id,
        email: user.email,
      });
      await seller.save({ session });
    }

    await session.commitTransaction()
    res.redirect("/login");
  } catch (error) {
    await session.abortTransaction();
    // console.log(error.message, "error message");
    if (error instanceof mongoose.Error) {
      return handleError(req, res, 400, {
        message: error.message.split(':', 2)[1],
        errors: error.errors,
        filePath: "auth/signup",
        pageTitle: "Sign Up",
        data: roles,
        formValues: req.body,
      });
    }
    return handleError(req, res, 500, {
      message: error?.message || "Internal server error",
      filePath: "auth/signup",
      pageTitle: "Sign Up",
      data: roles,
      formValues: req.body,
    });
  }
  finally {
    session.endSession()
  }
};

const handleLogin = async (req, res) => {
  const errors = validationResult(req);
  // console.log(errors, "validation errors")
  if (!errors.isEmpty()) {
    return handleError(req, res, 400, {
      message: errors.array()[0].msg,
      filePath: "auth/signin",
      pageTitle: "Log In",
      errors: errors.array(),
      formValues: req.body,
    });
  }
  try {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ email: email.trim() }).exec();
    if (!foundUser)
      return handleError(req, res, 401, {
        message: "Unauthorized login",
        filePath: "auth/signin",
        formValues: req.body,
      }); //Unauthorized
    const userRole = await Role.findById(foundUser.roleId).exec();

    // console.log(foundUser, 'found user')
    // const match = await bcrypt.compare(password.trim(), foundUser.password);
    // if (!match)
    //   return handleError(req, res, 400, {
    //     message: "Invalid credentials",
    //     filePath: "auth/signin",
    //     formValues: req.body,
    //   });

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          role: userRole.code,
          userId: foundUser._id,
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
    // console.log(accessToken, 'accessToken')
    // console.log(refreshToken, 'refreshToken')

    // await User.findOneAndUpdate({ email: foundUser.email }, { refreshToken }).exec();
    foundUser.refreshToken = refreshToken;
    await foundUser.save();
      // check if there's a guest cart and merge with user cart
    const sessionID = req.sessionID
    const cart = await Cart.findOne({ sessionId: sessionID }).exec()
    if(cart) {
      cart.sessionId = null;
      cart.buyerId = foundUser._id;
      cart.expiresAt = null;
      await cart.save()
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // if(!req.accepts("json")){
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
      maxAge: 30 * 60 * 1000,
    });

   
      res.redirect("/");
    
  } catch (error) {
    return handleError(req, res, 500, {
      message: error?.message || "Internal server error",
      filePath: "auth/signin",
    });
  }
};

const getLoginPage = async (req, res) => {
  res.render("auth/signin", {
    pageTitle: "Log In",
    path: "signin",
    validationErrors: [],
    errorMessage: "",
    formValues: {},
  });
};

const getSignupPage = async (req, res) => {
  // console.log(req.accepts(), 'accept heeaders')
  const roles = await Role.find(
    { name: { $not: { $regex: /^admin$/i } } },
    { name: 1, _id: 1 },
  ).exec();
  res.render("auth/signup", {
    pageTitle: "Sign Up",
    path: "signup",
    validationErrors: [],
    errorMessage: "",
    data: roles,
    formValues: {},
  });
};

const handleLogout = async (req, res) => {
  // console.log("handle logout function called");
  const cookies = req.cookies;
  if (!cookies?.refreshToken) return res.sendStatus(204); // No content
  const refreshToken = cookies?.refreshToken;

  // is refresh token in DB ?
  const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
  // console.log(foundUser, "found user");
  if (!foundUser) {
    // res.clearCookie("jwt", {httpOnly: true, maxAge: 24 * 60 * 60 * 1000})
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });
    // return res.sendStatus(204)
    res.redirect("/");
    return;
  }
  await User.findByIdAndUpdate(foundUser._id, { refreshToken: "" });
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });
  // return res.sendStatus(204)
  res.redirect("/");
};

export {
  handleRegister,
  handleLogin,
  getLoginPage,
  getSignupPage,
  handleLogout,
};

import bcrypt from "bcrypt";
import User from "../model/User.js";
import Role from "../model/Role.js";
import { handleError } from "../utils/handleError.js";
import { handleSuccess } from "../utils/handleSuccess.js";
import { validationResult } from "express-validator";
import mongoose from "mongoose";

const register = async (req, res) => {
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
    // if (!firstName || !lastName || !email || !password)
    //   return handleError(req, res, 400, {
    //     message: "All fields are required",
    //     page: "auth/signup",
    //     pageTitle: "Sign Up",
    //     data: roles,
    //     formValues: req.body,
    //   });

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

    const result = await user.save();
    // console.log(result, 'result')
    const message = `New user ${result.username} created!`;
    return handleSuccess(req, res, 201, {
      // message,
      pageTitle: "Sign In",
      path: "auth/signin",
      errors: {},
      errorMessage: "",
    });
    // return res.status(201).json({ message: `New user ${result.username} created!` });
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

export default register;

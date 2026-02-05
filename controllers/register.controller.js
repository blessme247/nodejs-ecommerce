import bcrypt from "bcrypt";
import User from "../model/User.js";
import Role from "../model/Role.js";
import { handleError } from "../utils/handleError.js";
import { handleSuccess } from "../utils/handleSuccess.js";

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, pwd, roleId } = req.body;
    if (!firstName || !lastName || !email || !pwd)
      return handleError(req, res, 400, { message: "All fields are required" });

    const duplicate = await User.findOne({ email }).exec();
    if (duplicate) return handleError(req, res, 409, { message: "Email already exists" });

    let role;
    if (!roleId) {
      role = await Role.findOne({ name: "Buyer" }).exec();
    } else {
      role = await Role.findById(roleId).exec();
    }
    const username = email.split("@")[0];
    const hashedPwd = await bcrypt.hash(pwd, 10);

    const user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPwd,
      roleId: role._id,
      username: username,
    });

    const result = await user.save();
    // console.log(result, 'result')
    const message = `New user ${result.username} created!`;
    return handleSuccess(req, res, 201, {
      message,
      pageTitle: "Sign In",
      path: "signin",
    //   validationErrors: {},
    //   errorMessage: ""
    });
    // return res.status(201).json({ message: `New user ${result.username} created!` });
  } catch (error) {
    console.log(error, "error")
    if (error instanceof mongoose.Error) {
      return handleError(req, res, 400, { errors: error.errors });
    }
    return handleError(
      req,
      res,
      500,
      { message: error?.message || "Internal server error" }
    );
  }
};

export default register;

import bcrypt from "bcrypt"
import User from "../model/User.js"
import Role from "../model/Role.js";
import { handleError } from "../utils/handleError.js";
import { handleSuccess } from "../utils/handleSuccess.js";

const register = async (req, res) => {
    try {
        
 
    const { user, pwd, roleId } = req.body;
    if (!user || !pwd) return handleError(req, res, 400, "Username and password are required");
  
    const duplicate = await User.findOne({username: user}).exec()
    if (duplicate) return handleError(req, res, 409, "Username already exists");

    let role 
    if(!roleId){
        role = await Role.findOne({name: "Buyer"}).exec()
    }else {
        role = await Role.findById(roleId).exec()
    }
        
        const hashedPwd = await bcrypt.hash(pwd, 10);
        const newUser = { 
            "username": user,
             "password": hashedPwd,
             "roleId": role._id
             };
       
        const result = await User.create(newUser)
        // console.log(result, 'result')
        const message = `New user ${result.username} created!`
        return handleSuccess(req, res, 201, { message, pageTitle: "Login", path: "login"})
        // return res.status(201).json({ message: `New user ${result.username} created!` });
    } catch (error) {
       return handleError(
             req,
             res,
             500,
             error?.message || "Internal server error",
           );
    }
}

export default register 
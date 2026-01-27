import bcrypt from "bcrypt"
import User from "../model/User.js"
import Role from "../model/Role.js";

const register = async (req, res) => {
    try {
        
 
    const { user, pwd, roleId } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
  
    const duplicate = await User.findOne({username: user}).exec()
    if (duplicate) return res.status(409).json({ 'message': ' Username already exists.' });

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
        return res.status(201).json({ 'success': `New user ${result.username} created!` });
    } catch (err) {
       return res.status(500).json({ 'message': err.message });
    }
}

export default register 
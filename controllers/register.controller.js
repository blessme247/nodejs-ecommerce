import bcrypt from "bcrypt"
import User from "../model/User.js"

const register = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
  
    const duplicate = await User.findOne({username: user}).exec()
    if (duplicate) return res.status(409).json({ 'message': ' Username already exists.' });
    try {
        
        const hashedPwd = await bcrypt.hash(pwd, 10);
        const newUser = { 
            "username": user,
             "password": hashedPwd,
            //   "roles": { "User": 2005, "Admin":2001,"Editor":2000 }
             };
       
        const result = await User.create(newUser)
        // console.log(result, 'result')
        return res.status(201).json({ 'success': `New user ${user} created!` });
    } catch (err) {
       return res.status(500).json({ 'message': err.message });
    }
}

export default register 
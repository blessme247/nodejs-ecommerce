//  import users from  "../model/users.json" with {type: "json"}
import bcrypt from "bcrypt"
// import fsPromises from "fs/promises"
// import path from "path"
// import { fileURLToPath } from 'url';
// import { dirname as pathDirname } from 'path';
import User from "../model/User.js"

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = pathDirname(__filename);

// const usersDB = {
//     users,
//     setUsers: function (data) { this.users = data }
// }

const register = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
    // check for duplicate usernames in the db
    // const duplicate = usersDB.users.find(person => person.username === user);
    const duplicate = await User.findOne({username: user}).exec()
    if (duplicate) return res.status(409).json({ 'message': ' Username already exists.' });
    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        //store the new user
        const newUser = { 
            "username": user,
             "password": hashedPwd,
            //   "roles": { "User": 2005, "Admin":2001,"Editor":2000 }
             };
        // usersDB.setUsers([...usersDB.users, newUser]);
        // await fsPromises.writeFile(
        //     path.join(__dirname, '..', 'model', 'users.json'),
        //     JSON.stringify(usersDB.users)
        // );
        const result = await User.create(newUser)
        console.log(result, 'result')
        return res.status(201).json({ 'success': `New user ${user} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

export default register 
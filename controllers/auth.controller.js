// import users from "../model/users.json" with { type: "json" }
import bcrypt from "bcrypt"
// import path from "path"
// import fsPromises from "fs/promises"
// import { dirname as pathDirname } from 'path';
import jwt from "jsonwebtoken"
// import { fileURLToPath } from 'url';
import User from "../model/User.js"


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = pathDirname(__filename);

// const usersDB = {
//     users,
//     setUsers: function (data) { this.users = data }
// }


const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
    // const foundUser = usersDB.users.find(person => person.username === user);
    const foundUser = await User.findOne({username: user}).exec()
    // console.log(foundUser, 'found user return query')
    if (!foundUser) return res.sendStatus(401); //Unauthorized 
    // evaluate password 
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles);
        // create JWTs
        const accessToken = jwt.sign(
            { 
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30m' }
        );
        const refreshToken = jwt.sign(
            { username: foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // const otherUsers = usersDB.users.filter((userr)=> userr.username !== foundUser.username)
        // const currentUser = {...foundUser, refreshToken}
        // usersDB.setUsers([...otherUsers, currentUser])
        // await fsPromises.writeFile(path.join(__dirname, "..", "model", "users.json"), JSON.stringify(usersDB.users))

       await User.findOneAndUpdate({username: user}, {refreshToken})
    //    console.log(result, 'updated user with refreshToken')
        res.cookie('jwt', refreshToken, {httpOnly: true, secure: true, sameSite: "None", maxAge: 24 * 60 * 60 * 1000})
        res.json({  accessToken });
    } else {
        res.sendStatus(401);
    }
}

export default  handleLogin 
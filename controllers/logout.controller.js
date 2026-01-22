// import users from "../model/users.json" with { type: "json" }
// import jwt from "jsonwebtoken"
// import path from "path"
// import fsPromises from "fs/promises"
// import { fileURLToPath } from 'url';
// import { dirname as pathDirname } from 'path';
import User from "../model/User.js"

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = pathDirname(__filename);


// const usersDB = {
//     users,
//     setUsers: function (data) { this.users = data }
// }


const handleLogout =  async (req, res) => {
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(204) // No content
    const refreshToken = cookies?.jwt

    // is refresh token in DB ?
    const foundUser = await User.findOne({refreshToken: refreshToken}).exec()
    if (!foundUser) {
        // res.clearCookie("jwt", {httpOnly: true, maxAge: 24 * 60 * 60 * 1000})
        res.clearCookie("jwt", {httpOnly: true, secure: true, sameSite: "None" })
        return res.sendStatus(204)
    }
    // delete refresh token in DB
    // const otherUsers = usersDB.users.filter((user)=> user.refreshToken !== foundUser.refreshToken)
    // const currentUser = {...foundUser, refreshToken: ''}
    // usersDB.setUsers([...otherUsers, currentUser])
    // await fsPromises.writeFile(path.join(__dirname, "..", "model", "users.json"), JSON.stringify(usersDB.users))
    await User.findByIdAndUpdate(foundUser._id, {refreshToken: ''})
    res.clearCookie("jwt", {httpOnly: true, secure: true, sameSite: "None" })
    return res.sendStatus(204)
}

export default  handleLogout 
// import users from "../model/users.json" with { type: "json" }
import jwt from "jsonwebtoken"
import User from "../model/User.js"


// const usersDB = {
//     users,
//     // setUsers: function (data) { this.users = data }
// }


const handleRefreshToken =  async (req, res) => {
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(401)
    const refreshToken = cookies?.jwt
    // const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    const foundUser = await User.findOne({refreshToken: refreshToken}).exec()
    if (!foundUser) return res.sendStatus(401); //Unauthorized 
    // evaluate refresh token 
   jwt.verify(refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decrypted)=> {
        if(err || foundUser.username !== decrypted.username) return res.sendStatus(403) // Forbidden
        const roles = Object.values(foundUser.roles)
        const accessToken = jwt.sign({"UserInfo": { "username": decrypted.username, "roles": roles}},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: "30m"}
        )
        res.json({accessToken})
    }
   )
}

export default  handleRefreshToken 
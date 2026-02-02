import jwt from "jsonwebtoken"
import User from "../model/User.js"


const handleRefreshToken =  async (req, res) => {
    const cookies = req.cookies
    if(!cookies?.jwt) res.status(401).json({message: "Unathorized"})
    const refreshToken = cookies?.jwt
    // const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    const foundUser = await User.findOne({refreshToken: refreshToken}).exec()
    if (!foundUser) res.status(401).json({message: "Unathorized"}); //Unauthorized 
    // evaluate refresh token 
   jwt.verify(refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decrypted)=> {
        if(err || foundUser.username !== decrypted.username) res.status(403).json({message: "Forbidden"}) // Forbidden
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
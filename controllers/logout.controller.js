import User from "../model/User.js"


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
    await User.findByIdAndUpdate(foundUser._id, {refreshToken: ''})
    res.clearCookie("jwt", {httpOnly: true, secure: true, sameSite: "None" })
    return res.sendStatus(204)
}

export default  handleLogout 
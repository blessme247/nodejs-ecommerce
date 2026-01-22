 const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
        if (!result) {
            console.log("Unauthorized access attempt detected");
            return res.sendStatus(403);
        }
        next();
    }
}

export default verifyRoles
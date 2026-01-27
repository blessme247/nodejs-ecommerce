 const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.role) return res.sendStatus(401).json({ message: "Unauthorized" });
        const rolesArray = [...allowedRoles];
        // const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
        const result = rolesArray.includes(req.role);
        if (!result) {
            console.log("Unauthorized access attempt detected");
            return res.sendStatus(403).json({ message: "Forbidden" });
        }
        next();
    }
}

export default verifyRoles
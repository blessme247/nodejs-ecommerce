import { handleError } from "../utils/handleError";

 const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.role) return handleError(req, res, 401, "Unathorized")
        const rolesArray = [...allowedRoles];
        const result = rolesArray.includes(req.role);
        if (!result) {
            console.log("Unauthorized access attempt detected");
            return handleError(req, res, 401, "Forbidden")
        }
        next();
    }
}

export default verifyRoles
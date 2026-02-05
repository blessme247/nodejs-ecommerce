import { handleError } from "../utils/handleError.js";

 const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.role) return handleError(req, res, 401, { message: "Unauthorized" });
        const rolesArray = [...allowedRoles];
        const result = rolesArray.includes(req.role);
        if (!result) {
            console.log("Unauthorized access attempt detected");
            return hhandleError(req, res, 403, { message: "Forbidden" });
        }
        next();
    }
}

export default verifyRoles
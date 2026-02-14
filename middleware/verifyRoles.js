import { getRoleName } from "../config/rolesList.js";
import { handleError } from "../utils/handleError.js";

 const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.role) return handleError(req, res, 401, { message: "Unauthorized in verifyRoles middleware", page: "auth/signin", pageTitle: "Sign In" });

         const roleName = getRoleName(req.role);
    
    if (!roleName) {
      console.error(`Invalid role detected: ${req.role}`);
      return handleError(req, res, 403, { message: "Forbidden" });
    }
        const rolesArray = [...allowedRoles];
        const result = rolesArray.includes(req.role);
        if (!result) {
            console.log("Unauthorized access attempt detected");
            return handleError(req, res, 403, { message: "Forbidden" });
        }
        res.locals.role = roleName
        next();
    }
}

export default verifyRoles
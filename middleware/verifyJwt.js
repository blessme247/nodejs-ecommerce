import jwt from "jsonwebtoken";
import { handleError } from "../utils/handleError.js";

const verifyJwt = (req, res, next) => {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  // if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({message: "Unathorized"})
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return handleError(req, res, 403, { message: "Forbidden" }); // invalid token
      req.user = decoded.UserInfo.username;
      req.role = decoded.UserInfo.role;
      next();
    });
  }

  const token = req.cookies?.accessToken;
  if (!token) {
    if (req.accepts("json")) {
      return handleError(req, res, 401,  { message: "Unauthorized" });
    }
    res.redirect("/login");
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (req.accepts("json")) {
        return handleError(req, res, 403, { message: "Forbidden" });
      }
      return res.redirect("/login"); // invalid token
    }
    req.user = decoded.UserInfo.username;
    req.role = decoded.UserInfo.role;
    next();
  });
};

export default verifyJwt;

// middleware/optionalAuth.js
import jwt from "jsonwebtoken";
import { getRoleName } from "../config/rolesList.js";

const optionalAuth = (req, res, next) => {
  // Try Authorization header first (for API clients)
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (!err) {
        // Valid token - set user info
        req.user = decoded.UserInfo.username;
        req.role = decoded.UserInfo.role;
        req.userId = decoded.UserInfo.userId;
        res.locals.role = getRoleName(req.role);
        res.locals.user = {
          username: decoded.UserInfo.username,
          role: getRoleName(req.role),
          // roleCode: req.role
        };
      }
      next();
    });
    return; 
  }

  // Try cookie token (for browser/EJS clients)
  const token = req.cookies?.accessToken;
  
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (!err) {
        req.user = decoded.UserInfo.username;
        req.role = decoded.UserInfo.role;
        req.userId = decoded.UserInfo.userId;
        res.locals.role = getRoleName(req.role);
        res.locals.user = {
          username: decoded.UserInfo.username,
          role: getRoleName(req.role),
          // roleCode: req.role
        };
      }
      next();
    });
  } else {
    req.user = null;
    req.role = null;
    res.locals.user = null;
    res.locals.role = null;
    next();
  }
};

export default optionalAuth;
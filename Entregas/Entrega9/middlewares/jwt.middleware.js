import jwt from "jsonwebtoken";
import configurationEnv from "../config/config.js";

export const jwtValidation = (req, res, next) => {
  try {
    console.log(req);
    const token = req.cookies.token;
    const userToken = jwt.verify(token, process.env.SECRET_KEY_JWT);
    req.user = userToken;
    next();
  } catch (error) {
    res.json({ error: error.message });
  }
};

import jwt from "jsonwebtoken";
import configurationEnv from "../config/config.js";

export const generateToken = (user) => {
    const token = jwt.sign({user}, process.env.SECRET_KEY_JWT, { expiresIn: 300 });
    return token;
};

export const decodeJWT = (token, signature) => {
    const payload = jwt.verify(token, signature)
    return payload
}
// _dirname
import { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import configurationEnv from "./config.js";

export const __dirname = dirname(fileURLToPath(import.meta.url));

export const hashData = async (data) => {
    return bcrypt.hash(data,10);
}

export const isPasswordValid = async (data, hashedData) => {
    return bcrypt.compare(data, hashedData);
}

export const generateToken = (user) => {
    const token = jwt.sign({user}, process.env.SECRET_KEY_JWT, { expiresIn: 300 });
    return token;
};
  
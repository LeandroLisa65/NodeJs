import dotenv from 'dotenv';
import program from './commander.js';

const { mode } = program.opts();

const get_mode = (mode) => {
    switch (mode) {
        case 'prod':
            return './.env.production';
        default:
            return './.env.development';
    }
}

dotenv.config({path: './.env'})
dotenv.config({
    path: get_mode(mode) 
})

const configurationEnv = {
    mongo_uri : process.env.MONGO_URI
    , secret_key_jwt : process.env.SECRET_KEY_JWT
    , port: process.env.PORT
    , jwt_cookie_key : process.env.JWT_COOKIE_KEY
    , nodemailer_gmail : process.env.NODEMAILER_GMAIL
    , nodemailer_pass : process.env.NODEMAILER_PASS
    , jwt_key : process.env.JWT_KEY
    , google_client_id : process.env.GOOGLE_CLIENT_ID
    , google_client_secret : process.env.GOOGLE_CLIENT_SECRET
    , google_callback : process.env.GOOGLE_CALLBACK
}

export default configurationEnv;
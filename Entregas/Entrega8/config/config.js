import dotenv from 'dotenv';
import program from './commander.js';

const { mode } = program.opts();

const get_mode = (mode) => {
    switch (mode) {
        case 'test':
            return './.env.testing';
        case 'prod':
            return './.env.prod';
        default:
            return './.env.dev';
    }
}

dotenv.config({path: './.env'})
dotenv.config({
    path: get_mode(mode) 
})

const configurationEnv = {
    mongo_uri: process.env.MONGO_URI
    , secret_key_jwt: process.env.SECRET_KEY_JWT
}

export default configurationEnv;
import mongoose from 'mongoose';
import configurationEnv from './config.js';

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Conectado a la base de datos'))
.catch((error) => console.log(error));
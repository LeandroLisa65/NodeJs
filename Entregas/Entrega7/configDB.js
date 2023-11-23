import mongoose from 'mongoose';

const URI = "mongodb+srv://leandromlisa:6PD1FqTXbhmjEScT@cluster0.cxg4lof.mongodb.net/ecommerce?retryWrites=true&w=majority"

mongoose.set('strictQuery', true);
mongoose.connect(URI)
.then(() => console.log('Conectado a la base de datos'))
.catch((error) => console.log(error));
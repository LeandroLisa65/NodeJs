import express from 'express';
import { __dirname } from './dirname.js';
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import "./config/configDB.js";
import session from 'express-session'
import MongoStore from 'connect-mongo';
import configurationEnv from './config/config.js';
import errorHandler from './middlewares/errorResponder.js'
import mainRouter from './routes/index.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser('SecretCookie'));

app.use(
  session({
      store: new MongoStore({
        mongoUrl: process.env.MONGO_URI,
      }),
      secret: "secretSession",
      cookie: {maxAge:60000},
}));

app.use(passport.initialize());
app.use(passport.session());

// handlebras
app.engine("handlebars", engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//routes
app.use(mainRouter)

//middlewares
app.use(errorHandler)

// ---- Sockets
import socketProduct from './utils/socketProducts.js'
import socketChat from './utils/socketChat.js'

const PORT = process.env.PORT
const httpServer = app.listen(PORT, () => {
    console.log('Server running on port: ' + PORT)
})

const io = new Server(httpServer)
socketProduct(io)
socketChat(io)

// ---- Passport
import passport from 'passport'
import { initPassport, initPassportGoogle } from './config/passport.js'
import cookieParser from 'cookie-parser'

initPassport()
initPassportGoogle()
app.use(passport.initialize())
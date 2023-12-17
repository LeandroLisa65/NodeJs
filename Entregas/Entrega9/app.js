import express from 'express';
import viewsRouter from "./routes/views.router.js";
import usersRouter from "./routes/users.router.js";
import clientsRouter from "./routes/clients.router.js";
import { __dirname } from './dirname.js';
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { chatManager } from './dao/mongo/ChatManager.js';
import invalidPathHandler from "./middlewares/errorPathHandler.js";
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
app.use("/api/views", viewsRouter);
app.use("/api/users", usersRouter);
app.use("/api/clients", clientsRouter);

app.use('/', (req, res) => {
  res.redirect('/api/views/login');
});

//middlewares
app.use(errorHandler)
app.use(invalidPathHandler);

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
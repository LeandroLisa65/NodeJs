import express from 'express';
import viewsRouter from "./routes/views.router.js";
import usersRouter from "./routes/users.router.js";
import clientsRouter from "./routes/clients.router.js";
import { __dirname } from './dirname.js';
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { productManager } from './dao/mongo/ProductManager.js';
import { chatManager } from './dao/mongo/ChatManager.js';
import invalidPathHandler from "./middlewares/errorPathHandler.js";
import "./config/configDB.js";
import session from 'express-session'
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import configurationEnv from './config/config.js';
import "./config/passport.js";
import passport from 'passport';
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
const httpServer = app.listen(process.env.PORT,()=>{
    console.log('Escuchando 8080');
})

const socketServer = new Server(httpServer);
const messages = [];
// connection - disconnect
socketServer.on("connection", async (socket) => {
  const query = {};
  const options = {
    limit: 100,
    page: 1,
    sort: 'asc'
}
  socket.emit("clientConnected", "cliente conectado");

  socket.emit("getProducts", await productManager.getProducts(query,options));

  socket.on("createProduct", async (product) => {
    await productManager.createProduct(product);
    socket.emit("getProducts", await productManager.getProducts(query,options));
  });

  socket.on("deleteProduct", async (id) => {
    await productManager.deleteProduct(id);
    socket.emit("getProducts", await productManager.getProducts(query,options));
  });
  
  socket.on("newUser", (user) => {
    socket.broadcast.emit("userConnected", user);
    socket.emit("connected");
  });
  socket.on("message", async (infoMessage) => {
    await chatManager.addMessage(infoMessage);
    messages.push(infoMessage);
    socketServer.emit("chat", messages);
  });

});

app.use(errorHandler)

//app.use(errorResponder);

app.use(invalidPathHandler);
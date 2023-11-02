import express from 'express';
import productRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import viewsRouter from "./routes/views.router.js";
import sessionRouter from './routes/session.router.js';
import { __dirname } from "./utils.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { productManager } from './dao/Dao/MongoDb/ProductManager.js';
import { chatManager } from './dao/Dao/MongoDb/ChatManager.js';
import errorLogger from './middlewares/errorLogger.js';
import invalidPathHandler from "./middlewares/errorPathHandler.js";
import errorResponder from './middlewares/errorResponder.js';
import "./configDB.js";
import MongoStore from 'mongo-connect';
import cookieParser
 from 'cookie-parser';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser);
app.use(express.static(__dirname + "/public"));

const URI = "mongodb+srv://leandromlisa:6PD1FqTXbhmjEScT@cluster0.cxg4lof.mongodb.net/ecommerce?retryWrites=true&w=majority";

app.use
(
  session(
    {
      store: new MongoStore({
        mongoUrl: URI,
      }),
      secret: "secretSession",
      cookie: {maxAge:60000},
    }
  )
);

// handlebras
app.engine("handlebars", engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//routes
app.use('/api/products',productRouter);
app.use('/api/carts',cartRouter);
app.use("/api/views", viewsRouter);
app.use("session",sessionRouter);

const httpServer = app.listen(8080,()=>{
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
    console.log(product);
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

app.use(errorLogger);

app.use(errorResponder);

app.use(invalidPathHandler);
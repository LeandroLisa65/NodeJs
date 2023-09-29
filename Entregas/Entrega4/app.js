import express from 'express';
import productRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import viewsRouter from "./routes/views.router.js";
import { __dirname } from "./utils.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { productManager } from './ProductManager.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// handlebras
app.engine("handlebars", engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//routes
app.use('/api/products',productRouter);
app.use('/api/carts',cartRouter);
app.use("/api/views", viewsRouter);

const httpServer = app.listen(8080,()=>{
    console.log('Escuchando 8080');
})

const socketServer = new Server(httpServer);

// connection - disconnect
socketServer.on("connection", async (socket) => {
  //console.log(`Cliente conectado: ${socket.id}`);
  socket.on("disconnect", () => {
    //console.log(`Cliente desconectado: ${socket.id}`);
  });
  socket.emit("priceUpdated", await productManager.getProducts(100));
  //socket.emit("welcome", "welcome to websocket");
  socket.on("newProduct", async (value) => {
    await productManager.createProduct(value);
    //socket.emit("priceUpdated", value);
    //socketServer.emit("priceUpdated", value);
    socket.emit("priceUpdated", await productManager.getProducts(100));
    console.log(value);
  });
});
import express from 'express';
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { __dirname } from "./utils.js";

import productRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import viewsRouter from "./routes/views.router.js";

import { productManager } from './dao/Dao/MongoDb/ProductManager.js';

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

  socket.emit("clientConnected", "cliente conectado");

  socket.emit("getProducts", await productManager.getProducts(100));

  socket.on("createProduct", async (product) => {
    await productManager.createProduct(product);
    socket.emit("productList", await productManager.getProducts(100));
  });

  socket.on("deleteProduct", async (id) => {
    await productManager.deleteProduct(id);
    socket.emit("getProducts", await productManager.getProducts(100));
  });
  
});
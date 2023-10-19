import express from "express";
import usersRouter from "./routes/users.router.js";
import productsRouter from "./routes/products.router.js";
import ordersRouter from "./routes/orders.router.js";
import viewsRouter from "./routes/views.router.js";
import { __dirname } from "./utils.js";
import { engine } from "express-handlebars";
import { Server } from 'socket.io';
import './configDB.js';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// handlebras
app.engine("handlebars", engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// routes
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/views", viewsRouter);

const httpListener = app.listen(8080, () => {
  console.log("Escuchando al puerto 8080");
});

const socketServer = new Server(httpListener);
socketServer.on('connection', socket=> 
{
  console.log(socket.id);
  socket.on('disconnect', () => 
  {
    console.log('Cliente desconectado:' + socket.id);
  })
  socket.on('newPrice', (value) => {
    socket.emit('priceUpdated', price);
    socketServer.emit('priceUpdated', price);
    socket.broadcast('priceUpdated', price);
  })
});
import { Router } from "express";
import { productManager } from "../dao/Dao/MongoDb/ProductManager.js";

const router = Router();
const products = JSON.parse(JSON.stringify((await productManager.getProducts(100))));

router.get("/", (req, res) => {
  res.render("home", { products: products });
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

router.get("/chat", (req, res) => {
  res.render("chat");
});

export default router;

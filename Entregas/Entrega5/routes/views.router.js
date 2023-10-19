import { Router } from "express";
import { productManager } from "../dao/Dao/MongoDb/ProductManager.js";

const router = Router();
const products = await productManager.getProducts(100);

router.get("/", (req, res) => {
  res.render("home", { products: products });
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

export default router;

import express from "express";
import { manager } from './ProductManager.js';

const app = express();

app.get('/',(req,res)=>{
    res.send('Probando')
})

app.listen(8080,()=>{
    console.log('Escuchando 8080');
})

app.get('/api/products',async (req,res)=>{
    const products = await manager.getProducts();
    res.json({message:'Products found', products: products})
})

app.get('/api/products/:id',async (req,res)=>{
    const {id} = req.params;
    const product = await manager.getProductById(id);
    res.json({message:'Product found', product: product})
})
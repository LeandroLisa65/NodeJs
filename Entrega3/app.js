import express from "express";
import { manager } from './ProductManager.js';

const app = express();
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Probando')
})

app.listen(8080,()=>{
    console.log('Escuchando 8080');
})

app.get('/api/products',async (req,res)=>{
    try {
    const queryObj = req.query;
    const products = await manager.getProducts(queryObj);
    res.status(200).json({message:'Products found', products: products})
    }
    catch(error)
    {
        res.status(500).json({message: error.message})
    }
})

app.get('/api/products/:id',async (req,res)=>{
    try {
    const {id} = req.params;
    const response = await manager.getProductById(id);
    if(!response)
        res.status(404).json({message:response});
    res.status(200).json({message:'Product found', product: response})
    }
    catch(error)
    {
        res.status(500).json({message: error.message})
    }
})

app.post('/api/products',async (req,res)=>{
    try {
    const {title, description, price, thumbnail, code, stock} = req.body;
    if(!title || !description || !price || !thumbnail || !code || !stock)
        res.json(404).json({message: "Some data is missing"});
    const response = await manager.createProduct(req.body);
    res.status(200).json({message:response});
    }
    catch(error)
    {
        res.status(500).json({message: error.message})
    }
})

app.put('/api/products/:id',async (req,res)=>{
    try {
    const {id} = req.params;
    const product = req.body;
    const response = await manager.updateProduct(id, product);
    res.json({message:response});
    }
    catch(error)
    {
        res.status(500).json({message: error.message})
    }
})

app.delete('/api/products/:id',async (req,res)=>{
    try {
    const {id} = req.params;
    const response = await manager.deleteProduct(id);
    res.json({message:response});
    }
    catch(error)
    {
        res.status(500).json({message: error.message})
    }
})
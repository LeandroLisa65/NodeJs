import { Router } from 'express';
import { productManager } from '../dao/Dao/MongoDb/ProductManager.js';

const router = Router();

router.get('/',async (req,res)=>{
    try {
    const queryObj = req.query;
    const products = await productManager.getProducts(queryObj);
    res.status(200).json({message:'Products found', products: products})
    }
    catch(error)
    {
        res.status(500).json({message: error.message})
    }
})

router.get('/:pid',async (req,res)=>{
    try {
    const {pid} = req.params;
    const response = await productManager.getProductById(pid);
    if(!response)
        res.status(404).json({message:response});
    res.status(200).json({message:'Product found', product: response})
    }
    catch(error)
    {
        res.status(500).json({message: error.message})
    }
})

router.post('/',async (req,res)=>{
    try {
    const {title, description, code, price, status, stock} = req.body;
    if(!title || !description || !price || !code || !status || !stock)
        res.status(404).json({message: "Some data is missing"});
    const response = await productManager.createProduct(req.body);
    res.status(200).json({message:response});
    }
    catch(error)
    {
        res.status(500).json({message: error.message})
    }
})

router.put('/:pid',async (req,res)=>{
    try {
    const {pid} = req.params;
    const product = req.body;
    const response = await productManager.updateProduct(pid, product);
    res.json({message:response});
    }
    catch(error)
    {
        res.status(500).json({message: error.message})
    }
})

router.delete('/:pid',async (req,res)=>{
    try {
    const {pid} = req.params;
    const response = await productManager.deleteProduct(pid);
    res.json({message:response});
    }
    catch(error)
    {
        res.status(500).json({message: error.message})
    }
})

export default router;
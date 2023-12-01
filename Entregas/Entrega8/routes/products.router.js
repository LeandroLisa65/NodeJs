import { Router } from 'express';
import { productManager } from '../dao/mongo/ProductManager.js';
import productController  from '../controllers/products.controller.js';

const router = Router();

router.get('/', async (req, res) => {
    try
    {
        console.log('hello')
        res.json(await productController.get(req, res))
    }catch(error){
        res.json({message: error});
    }
})

router.get('/:pid',async (req, res, next)=>{
    try {
    const {pid} = req.params;
    const response = await productManager.getProductById(pid);
    if(!response)
        res.status(404).json({message:response});
    res.status(200).json({message:'Product found', product: response})
    }
    catch(error)
    {
        next(error);
    }
})

router.post('/',async (req, res, next)=>{
    try {
    const {title, description, code, price, status, stock, category} = req.body;
    if(!title || !description || !price || !code || !status || !stock || !category)
        res.status(404).json({message: "Some data is missing"});
    const response = await productManager.createProduct(req.body);
    res.status(200).json({message:response});
    }
    catch(error)
    {
        next(error);
    }
})

router.put('/:pid',async (req, res, next)=>{
    try {
    const {pid} = req.params;
    const product = req.body;
    const response = await productManager.updateProduct(pid, product);
    res.json({message:response});
    }
    catch(error)
    {
        next(error);
    }
})

router.delete('/:pid',async (req, res, next)=>{
    try {
        const {pid} = req.params;
        const response = await productManager.deleteProduct(pid);
        res.json({message:response});
    }
    catch(error)
    {
        next(error);
    }
})

export default router;
import { Router } from 'express';
import { cartManager } from '../dao/Dao/MongoDb/CartManager.js';

const router = Router();

router.get('/',async (req, res, next) => {
    try 
    {
    const queryObj = req.query;
    const carts = await cartManager.getCarts(queryObj);
    res.status(200).json({message:'Carts found', carts: carts})
    }
    catch(error)
    {
        next(error);
    }
})

router.get('/:cid',async (req, res, next) =>{
    try 
    {
    const response = await cartManager.getCartById(req.params.cid);
    if(!response)
        res.status(404).json({message:response});
    res.status(200).json({message:'Cart found', cart: response})
    }
    catch(error)
    {
        next(error);
    }
})

router.post('/',async (req, res, next) =>{
    try 
    {
    const response = await cartManager.createCart();
    res.status(200).json({message:response});
    }
    catch(error)
    {
        next(error);s
    }
})

router.post('/:cid/product/:pid',async (req, res, next) =>{
    try 
    {
    const {cid} = req.params;
    const {pid} = req.params;
    const response = await cartManager.addProduct(cid,pid);
    res.status(200).json({message:response});
    }
    catch(error)
    {
        next(error);
    }
})

router.delete('/:cid/products/:pid', async (req, res, next) => {
    try
    {
        const response = await cartManager.deleteProductFromCart(req.params.cid, req.params.pid);
        res.status(200).json({message:response});
    }
    catch(error)
    {
        next(error);
    }
})

router.put('/:cid', async (req, res, next) => {
    try
    {
        const { products } = req.body

        const response = await cartManager.updateCart(req.params.cid, products)

        if(!response)
            res.status(404).json({message:response});
        
        res.status(200).json({message:'Cart Updated', cart: {}})
    }catch(error)
    {
        next(error);
    }
})

router.put('/:cid/products/:pid', async (req, res, next) => {
    try{
        const quantity = req.body.quantity
        const response = await cartManager.updateQuantity(req.params.cid, req.params.pid, quantity)

        if(!response)
            res.status(404).json({message:response});
        
        res.status(200).json({message:response});
    }catch(error)
    {
        next(error);
    }
})

router.delete('/:cid', async (req, res, next) => {
    try
    {
        const response = await cartManager.deleteAllProductsFromCart(req.params.cid);

        if(!response)
            res.status(404).json({message:response});
    
        res.status(200).json({message:response});
    }
    catch(error)
    {
        next(error);
    }
})

export default router;
import { Router } from 'express';
import { cartManager } from '../dao/Dao/MongoDb/CartManager.js';

const router = Router();

router.get('/',async (req,res)=>{
    try {
    const queryObj = req.query;
    const carts = await cartManager.getCarts(queryObj);
    res.status(200).json({message:'Carts found', carts: carts})
    }
    catch(error)
    {
        res.status(500).json({message: error.message})
    }
})

router.get('/:cid',async (req,res)=>{
    try {
    const {cid} = req.params;
    const response = await cartManager.getCartById(cid);
    if(!response)
        res.status(404).json({message:response});
    res.status(200).json({message:'Cart found', cart: response})
    }
    catch(error)
    {
        res.status(500).json({message: error.message})
    }
})

router.post('/',async (req,res)=>{
    try {
    const response = await cartManager.createCart();
    res.status(200).json({message:response});
    }
    catch(error)
    {
        res.status(500).json({message: error.message})
    }
})

router.post('/:cid/product/:pid',async (req,res)=>{
    try {
    const {cid} = req.params;
    const {pid} = req.params;
    const response = await cartManager.addProduct(cid,pid);
    res.status(200).json({message:response});
    }
    catch(error)
    {
        res.status(500).json({message: error.message})
    }
})

export default router;
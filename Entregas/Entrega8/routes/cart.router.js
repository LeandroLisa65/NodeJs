import cartController  from '../controllers/carts.controller.js';
import { Router } from 'express';

const router = Router();

router.get('/',async (req, res, next) =>{
    try 
    {
        res.status(200).json(await cartController.get())
    }
    catch(error)
    {
        next(error);
    }
})

router.get('/:cid',async (req, res, next) =>{
    try 
    {
        res.status(200).json(await cartController.getById(req))
    }
    catch(error)
    {
        next(error);
    }
})

router.post('/',async (req, res, next) =>{
    try 
    {
        res.status(200).json(await cartController.create());
    }
    catch(error)
    {
        next(error);s
    }
})

router.post('/:cid/product/:pid',async (req, res, next) =>{
    try 
    {
        res.status(200).json(await cartController.addProduct(req));
    }
    catch(error)
    {
        next(error);
    }
})

router.delete('/:cid/products/:pid', async (req, res, next) => {
    try
    {
        res.status(200).json(await cartController.deleteProduct(req));
    }
    catch(error)
    {
        next(error);
    }
})

router.put('/:cid', async (req, res, next) => {
    try
    {
        console.log('hello')
        res.status(200).json(await cartController.update(req))
    }catch(error)
    {
        next(error);
    }
})

router.put('/:cid/products/:pid', async (req, res, next) => {
    try
    {     
        const resp = await cartController.updateQuantity(req)
        console.log(resp)
        console.log('fin')

        res.status(200).json(resp);
    }
    catch(error)
    {
        console.log(error)
        next(error);
    }
})

router.delete('/:cid', async (req, res, next) => {
    try
    {   
        res.status(200).json(await cartController.deleteAllProducts(req));
    }
    catch(error)
    {
        next(error);
    }
})

export default router;
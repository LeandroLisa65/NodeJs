import productController  from '../controllers/products.controller.js';
import { Router } from 'express';

const productRouter = Router();

productRouter.get('/', async (req, res, next) => {
    try
    {
        console.log('hola')
        res.status(200).json(await productController.get(req, res, next))
    }
    catch(error)
    {
        next(error);
    }
})

productRouter.get('/:pid',async (req, res, next)=>{
    try 
    {
        res.status(200).json(await productController.getById(req, res, next))
    }
    catch(error)
    {
        next(error);
    }
})

productRouter.post('/',async (req, res, next)=>{
    try 
    {
        res.status(200).json(await productController.create(req, res, next));
    }
    catch(error)
    {
        next(error);
    }
})

productRouter.put('/:pid',async (req, res, next)=>{
    try 
    {
        res.status(200).json(await productController.update(req, res, next));
    }
    catch(error)
    {
        next(error);
    }
})

productRouter.delete('/:pid',async (req, res, next)=>{
    try 
    {
        res.status(200).json(await productController.delete(req, res, next));
    }
    catch(error)
    {
        next(error);
    }
})


export default productRouter;
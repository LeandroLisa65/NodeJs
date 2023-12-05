import { cartService } from '../repositoryservices/index.js'

class CartController {

    get = async (req, res, next) => {
        try
        {
            return await cartService.get();
        }
        catch(error)
        {  
            throw error
        }
    }

    getById = async (req, res, next) => {
        try
        {
            return await cartService.getById(req.params.cid);
        }
        catch(error)
        {  
            throw error
        }
    }

    create = async (req, res, next) => {
        try
        {
            return await cartService.create()
        }
        catch(error)
        {
            throw error
        }
    }

    addProduct = async (req, res, next) => {
        try
        {
            return await cartService.add(req.params.cid, req.params.pid) 
        }
        catch (error)
        {
            throw error
        }
    }

    update = async (req, res, next) => {
        try
        {
            return await cartService.update(req.params.cid, req.body)
        }
        catch(error)
        {
            throw error
        }
    }

    updateQuantity = async (req, res, next) => {
        try
        {
            console.log(req.params)
            console.log(req.body)
            return await cartService.updateQuantity(req.params.cid, req.params.pid, req.body.quantity)
        }
        catch(error)
        {
            throw error
        }
    }

    deleteProduct = async (req,res) => {
        try
        {
            return await cartService.delete(req.params.cid, req.params.pid)
        }
        catch(error)
        {
            throw error
        }
    }

    deleteAllProducts = async (req,res) => {
        try
        {
            return await cartService.deleteAll(req.params.cid)
        }
        catch(error)
        {
            throw error
        }
    }
}

const cartController = new CartController();

export default cartController;
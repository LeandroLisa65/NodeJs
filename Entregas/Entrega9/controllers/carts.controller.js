import { cartService, productService, userService, ticketService } from '../repositoryservices/index.js'
import crypto from 'crypto'

class CartController {
    get = async (req, res) => {
        try{
            return await cartService.get()
        }catch(error){  
            throw error
        }
    }

    getById = async (req, res) => {
        try{
            const cart = await cartService.getById(req.params.cid)
            if(!cart){
                throw new Error('Could not find a cart with the ID: ' + req.params.cid)
            }else{
                return cart 
            }
        }catch(error){  
            throw error
        }
    }

    create = async (req, res) => {
        try{
            const createdCart = await cartService.create()
            return { createdCart }
        }catch(error){
            throw error
        }
    }

    addProduct = async (req, res) => {
        try{
            const product = await productService.getById(req.params.pid)

            if(req.user.user.email === product.owner){
                res.send({status: 'error', message: "You can't add products to your cart that you own"})
            }

            const addedProduct = await cartService.add(req.params.cid, req.params.pid)
            return addedProduct 
        }catch (error){
            throw error
        }
    }

    update = async (req, res) => {
        try{
            const { products } = req.body
            const updatedCart = await cartService.update(req.params.cid, products)
            return { updatedCart }
        }catch(error){
            throw error
        }
    }

    updateQuantity = async (req, res) => {
        try{
            const quantity = req.body.quantity
            const updatedProduct = await cartService.updateQuantity(req.params.cid, req.params.pid, quantity)
            return { updatedProduct }
        }catch(error){
            throw error
        }
    }

    deleteProduct = async (req,res) => {
        try{
            const deletedProduct = await cartService.delete(req.params.cid, req.params.pid)
            return { deletedProduct }
        }catch(error){
            throw error
        }
    }

    deleteAllProducts = async (req,res) => {
        try{
            const deletedProducts = await cartService.deleteAll(req.params.cid)
            return { deletedProducts }
        }catch(error){
            throw error
        }
    }

    generatePurchase = async (req, res) => {
        try{
            let ticketToSend = {}
            let outOfStock = []
            const cid = req.params.cid
            const cart = await cartService.getById(cid)

            for(const orderedProduct of cart.products){
                const stock = orderedProduct.product.stock
                const quantity = orderedProduct.quantity
                const pid = orderedProduct.product._id

                if(stock >= quantity){
                    orderedProduct.product.stock -= quantity
                    await productService.update(pid, orderedProduct.product)
                }else{
                    outOfStock.push(orderedProduct)
                }
            }

            const purchasedProducts = cart.products.filter(product => !outOfStock.includes(product))
            if(purchasedProducts.length > 0){
                // Date
                const date = new Date()
                const formattedDate = `${date.getHours()}:${date.getMinutes()}/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                    
                // Code
                const code = crypto.randomUUID()
                
                // User email
                const user = await userService.getByCartId(cid)
                const userEmail = user.email

                const ticket = {
                    code: code,
                    purchase_datetime: formattedDate,
                    amount: purchasedProducts.reduce((total, product) => total + (product.quantity * product.product.price), 0),
                    purchaser: userEmail
                }
                
                ticketToSend = await ticketService.create(ticket)
            }
            
            if(outOfStock.length > 0){
                return {ticket: ticketToSend, outOfStockProducts: outOfStock.map(product => product.product._id)}
            }else{
                return {ticket: ticketToSend}
            }
        }catch(error){
            throw error
        }
    }
}

const cartController = new CartController();

export default cartController;
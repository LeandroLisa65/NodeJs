import { productManager } from './ProductManager.js';
import { cartModel } from '../../models/carts.model.js';

class CartManager {

    async getCarts(){
        try {
            const cartsData = await cartModel.find();
            return cartsData;
        }
        catch(error){
            throw error;
        }
    }

    async createCart(){
        try {
            const response = await cartModel.create({});
            return `Cart with id ${response._id} CREATED`;
        } catch (error) {
            throw error;
        }
    };

    async addProduct(cid, pid){
        try {
            const cart = await this.getCartById(cid);
            if(typeof(cart) == 'string')
                return cart;

            const product = await productManager.getProductById(pid);
            if(typeof(product) == 'string')
                return product;

            const productFound = cart.products.find(x => x.productId == pid);
            if(!productFound)
                cart.products.push({productId: product._id, quantity: 1})
            else
                productFound.quantity++;

            await this.#updateCart(cid,cart);

            return `Product with id ${pid} added to Cart ${cid}`; 
        } catch (error) {
            throw error;
        }
    }

    async getCartById(cid) {
        try {
            const cart = await cartModel.findOne({_id: cid}).populate('products.product')
            if(!cart)
                throw new Error(`Cart with id ${cid} NOT FOUND`);
            return cart;
        } catch (error) {
            throw error;
        }
    };

    async #updateCart(cid, updatedCart){
        try {
            await cartModel.updateOne({_id:cid}, updatedCart);
            return `Cart with id ${cid} UPDATED`;
        } catch (error) {
            throw error;
        }
    };

    async #deleteCart(id) {
        try {
            await cartModel.deleteOne({_id:id});
            return `Cart with id ${id} DELETED`;
        } catch (error) {
            throw error;
        }
    };

    async deleteProductFromCart(cid, pid)
    {
        try 
        {
            const cart = await cartModel.findOne({_id: cid})
            const index = cart.products.findIndex(product => product.product == pid)

            if(index === -1){
                return null
            }else{
                const filter = { _id: cid };
                const update = { $pull: { products: { product: pid } } }
                await cartModel.findOneAndUpdate(filter, update)
            }

            return `Product ${pid} in Cart ${id} DELETED`;
        } 
        catch (error) {
            throw error;
        }
    }

    async updateCart(cid, products){
        try
        {
            const update = { $set: { products: products  } }
            return await cartModel.findOneAndUpdate({_id: cid}, update)
        }
        catch(error){
            throw error;
        }
    }

    async updateQuantity(cid, pid, quantity)
    {
        try
        {
            const cart = await cartModel.findOne({_id: cid})
            const index = cart.products.findIndex(product => product.product == pid)

            if (index === -1 || quantity < 1) 
            {
                return null
            }
            else 
            {
                const filter = { _id: cid, 'products.product': pid };
                const update = { $set: { 'products.$.quantity': quantity } };
                await cartModel.updateOne(filter, update);
            }

            return `Cart with id ${cid} UPDATED`;
        }
        catch(error){
            throw error;
        }
    }

    async deleteAllProductsFromCart(cid){
        try{
            const update = { $set: { products: [] } }
            await cartModel.updateOne({ _id: cid }, update)
            return `Cart with id ${cid} UPDATED`;
        }
        catch(error){
            throw error;
        }
    }
}

export const cartManager = new CartManager();
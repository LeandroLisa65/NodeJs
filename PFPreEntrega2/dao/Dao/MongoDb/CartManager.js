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

    async getCartById(id) {
        try {
            const cart = await cartModel.findById(id);
            if(!cart)
                throw new Error(`Cart with id ${id} NOT FOUND`);
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
}

export const cartManager = new CartManager();
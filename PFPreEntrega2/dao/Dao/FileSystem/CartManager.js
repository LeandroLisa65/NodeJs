import { existsSync, promises } from 'fs';
import { randomUUID } from 'crypto'
import { productManager } from './ProductManager.js';

const path = './dao/Dao/FileSystem/Carrito.json';

class CartManager {

    constructor(pathParam){
        this.path = pathParam;
    }

    async getCarts(){
        try {
            if(existsSync(this.path))
            {
                const cartsFile = await promises.readFile(this.path, 'utf-8',(err) => {
                console.log(err);
                });
                const cartsData = JSON.parse(cartsFile);
                return cartsData;
            }
            else 
            {
                return [];
            }
        }
        catch(error){
            throw error;
        }
    }

    async createCart(){
        try {
            const carts = await this.getCarts();
            const cartId = randomUUID();
            carts.push({id: cartId , products: []});
            await promises.writeFile(this.path, JSON.stringify(carts));
            return `Cart with id ${cartId} CREATED`;
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
                cart.products.push({productId: product.id, quantity: 1})
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
            const carts = await this.getCarts();
            const cart = carts.find(x => x.id == id);
            if(!cart)
                throw new Error(`Cart with id ${id} NOT FOUND`);
            return cart;
        } catch (error) {
            throw error;
        }
    };

    async #updateCart(cid, updatedCart){
        try {
            const cart = await this.getCartById(cid);

            Object.keys(updatedCart).forEach(key => {
                if(key === 'id')
                    return;
                if(updatedCart[key] && cart[key])
                    cart[key] = updatedCart[key];
            });
    
            await this.#deleteCart(cid);
            const carts = await this.getCarts({});
            carts.push(cart);
            await promises.writeFile(this.path, JSON.stringify(carts));
            return `Cart with id ${cid} UPDATED`;
        } catch (error) {
            throw error;
        }
    };

    async #deleteCart(id) {
        try {
            const carts = await this.getCarts();
            const newArrayProducts = carts.filter(x => x.id != id);
            await promises.writeFile(this.path, JSON.stringify(newArrayProducts));
            return `Cart with id ${id} DELETED`;
        } catch (error) {
            throw error;
        }
    };
}

export const cartManager = new CartManager(path);
import { promises } from 'fs'

class CartManagerFile {
    constructor() {
        this.filename = './src/dao/filesystem/data/carts.json'
        this.initializeFile()
    }

    async initializeFile() {
        try {
            await promises.access(this.filename);
        } catch (error) {
            await promises.writeFile(this.filename, '[]');
        }
    }

    async saveCarts(carts) {
        try {
            const data = JSON.stringify(carts);
            await promises.writeFile(this.filename, data, 'utf-8');
        } catch (error) {
            throw new Error('Failed to save carts:', error);
        }
    }

    async createCart() {
        try {
            const carts = await this.getCarts();
            const newCart = {
                id: carts.length + 1,
                products: []
            };
            carts.push(newCart);
            await this.saveCarts(carts);
            return newCart;
        } catch (error) {
            throw new Error('Failed to create cart:', error);
        }
    }

    async getCarts() {
        try {
            const data = await promises.readFile(this.filename, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            throw new Error('Failed to get carts:', error);
        }
    }

    async getCartById(cid) {
        try {
            const carts = await this.getCarts();
            return carts.find(cart => cart.id === cid);
        } catch (error) {
            throw new Error('Failed to get cart by ID:', error);
        }
    }

    async addProductToCart(cid, pid) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(cart => cart.id === cid);
            if (!cart) {
                throw new Error('Cart not found');
            }
            const existingProduct = cart.products.find(prod => prod.id === pid);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                const product = { id: pid, quantity: 1 };
                cart.products.push(product);
            }
            await this.saveCarts(carts);
            return cart;
        } catch (error) {
            throw new Error('Failed to add product to cart:', error);
        }
    }

    async deleteProductFromCart(cid, pid) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(cart => cart.id === cid);
            if (!cart) {
                throw new Error('Cart not found');
            }
            cart.products = cart.products.filter(product => product.id !== pid);
            await this.saveCarts(carts);
            return cart;
        } catch (error) {
            throw new Error('Failed to delete product from cart:', error);
        }
    }

    async updateCart(cid, products) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(cart => cart.id === cid);
            if (!cart) {
                throw new Error('Cart not found');
            }
            cart.products = products;
            await this.saveCarts(carts);
            return cart;
        } catch (error) {
            throw new Error('Failed to update cart:', error);
        }
    }

    async updateQuantity(cid, pid, quantity) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(cart => cart.id === cid);
            if (!cart) {
                throw new Error('Cart not found');
            }
            const product = cart.products.find(prod => prod.id === pid);
            if (!product) {
                throw new Error('Product not found in cart');
            }
            product.quantity = quantity;
            await this.saveCarts(carts);
            return cart;
        } catch (error) {
            throw new Error('Failed to update quantity:', error);
        }
    }

    async deleteAllProductsFromCart(cid) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(cart => cart.id === cid);
            if (!cart) {
                throw new Error('Cart not found');
            }
            cart.products = [];
            await this.saveCarts(carts);
            return cart;
        } catch (error) {
            throw new Error('Failed to delete all products from cart:', error);
        }
    }
}

export default CartManagerFile
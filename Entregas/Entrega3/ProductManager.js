import { existsSync, promises } from 'fs';
import { randomUUID } from 'crypto'
const path = './Products.json';

class ProductManager {

    constructor(pathParam){
        this.path = pathParam;
    }

    async getProducts(queryObj){
        try{
            if(existsSync(this.path))
            {
                const {limit} = queryObj;
                const productsFile = await promises.readFile(this.path, 'utf-8',(err) => {
                console.log(err);
                });
                const productsData = JSON.parse(productsFile);
                return limit ? productsData.slice(0, +limit) : productsData;
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

    async createProduct(product){
        try {
            const products = await this.getProducts({});
            const productId = randomUUID();
            products.push({id: productId ,...product});
            await promises.writeFile(this.path, JSON.stringify(products));
            return `Product with id ${productId} CREATED`;
        } catch (error) {
            throw error;
        }
    };

    async deleteProduct(id) {
        try {
            const products = await this.getProducts({});
            const newArrayProducts = products.filter(x => x.id != id);
            if(products.length === newArrayProducts.length)
                throw new Error(`Product with id ${id} NOT FOUND`);

            await promises.writeFile(this.path, JSON.stringify(newArrayProducts));
            return `Product with id ${id} DELETED`;
        } catch (error) {
            throw error;
        }
    };

    async getProductById(id) {
        try {
            const products = await this.getProducts({});
            const product = products.find(x => x.id == id);
            if(!product)
                throw new Error(`Product with id ${id} NOT FOUND`);
            return product;
        } catch (error) {
            throw error;
        }
    };

    async updateProduct(id, updatedProduct){
        try {
            const product = await this.getProductById(id);
            if(typeof(product) == 'string')
                return product;
    
            Object.keys(updatedProduct).forEach(key => {
                if(key === 'id')
                    return;
                if(updatedProduct[key] && product[key])
                    product[key] = updatedProduct[key];
            });
    
            await this.deleteProduct(id);
            const products = await this.getProducts({});
            products.push(product);
            await promises.writeFile(this.path, JSON.stringify(products));
            return `Product with id ${id} UPDATED`;
        } catch (error) {
            throw error;
        }
    };
}

export const manager = new ProductManager(path);







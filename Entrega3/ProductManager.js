import { existsSync, promises } from 'fs';

const path = './Products.json';

class ProductManager {

    constructor(pathParam){
        this.path = pathParam;
    }
    static GlobalId = 1;
    async getProducts(){
        try{
            if(existsSync(this.path))
            {
                const productsFile = await promises.readFile(this.path, 'utf-8',(err) => {
                console.log(err);
                });
                return JSON.parse(productsFile);
            }
            else 
            {
                return [];
            }
        }
        catch(error){
            return error;
        }
    }

    async createProduct(product){
        try {
            const products = await this.getProducts();
            const productId = ProductManager.GlobalId++
            products.push({id: productId ,...product});
            await promises.writeFile(this.path, JSON.stringify(products));
            return `Product with id ${productId} CREATED`;
        } catch (error) {
            return error;
        }
    };

    async deleteProduct(id) {
        try {
            const products = await this.getProducts();
            const newArrayProducts = products.filter(x => x.id != id);
            if(products.length === newArrayProducts.length)
                return `Product with id ${id} NOT FOUND`;

            await promises.writeFile(this.path, JSON.stringify(newArrayProducts));
            return `Product with id ${id} DELETED`;
        } catch (error) {
            return error;
        }
    };

    async getProductById(id) {
        try {
            const products = await this.getProducts();
            const product = products.find(x => x.id == id);
            if(!product)
                return `Product with id ${id} NOT FOUND`;
            return product;
        } catch (error) {
            return error;
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
            const products = await this.getProducts();
            products.push(product);
            await promises.writeFile(this.path, JSON.stringify(products));
            return `Product with id ${id} UPDATED`;
        } catch (error) {
            return error;
        }
    };
}

export const manager = new ProductManager(path);





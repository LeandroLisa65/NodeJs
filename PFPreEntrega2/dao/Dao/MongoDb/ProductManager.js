import { productModel } from '../../models/products.model.js';

class ProductManager {

    async getProducts(query, options){
        try{
            return await productModel.paginate(query, options)
        }
        catch(error){
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const product = await productModel.findById(id);
            if(!product)
                throw new Error(`Product with id ${id} NOT FOUND`);
            return product;
        } catch (error) {
            throw error;
        }
    };
    
    async createProduct(product){
        try {
            const response = await productModel.create(product);
            return `Product with id ${response._id} CREATED`;
        } catch (error) {
            throw error;
        }
    };

    async deleteProduct(id) {
        try {
            await productModel.deleteOne({_id:id});
            return `Product with id ${id} DELETED`;
        } catch (error) {
            throw error;
        }
    };

    async updateProduct(id, updatedProduct){
        try {
            await productModel.updateOne({_id:id}, updatedProduct);
            return `Product with id ${id} UPDATED`;
        } catch (error) {
            throw error;
        }
    };
}

export const productManager = new ProductManager();







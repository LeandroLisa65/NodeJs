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

    async getProductById(pid){
        try{
            return await productModel.findOne({_id: pid})
        }catch(err){
            return new Error(err)
        }
    }
    
    async createProduct(product){
        try{
            return await productModel.create(product)
        }catch(err){
            return new Error(err)
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







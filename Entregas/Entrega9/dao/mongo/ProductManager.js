import { productModel } from './models/products.model.js';

class ProductMongoManager {

    async get(query, options)
    {
        try
        {
            return await productModel.paginate(query, options)
        }
        catch(error)
        {
            throw error;
        }
    }

    async getById(pid)
    {
        try
        {
            return await productModel.findOne({_id: pid})
        }
        catch(error)
        {
            throw error;
        }
    }
    
    async create(product)
    {
        try
        {
            return await productModel.create(product)
        }
        catch(error)
        {
            throw error;
        }
    };

    async delete(id) {
        try 
        {
            return await productModel.deleteOne({_id:id});
        }
        catch(error)
        {
            throw error;
        }
    };

    async update(id, updatedProduct)
    {
        try 
        {
            return await productModel.updateOne({_id:id}, updatedProduct);
        }
        catch(error)
        {
            throw error;
        }
    };
}

export const productManager = new ProductMongoManager();







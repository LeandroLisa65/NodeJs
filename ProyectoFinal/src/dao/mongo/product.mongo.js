import productModel from './models/product.model.js'

class ProductManagerMongo {
    constructor(model){
        this.productModel = model
    }

    async getProducts(query, options){
        try{
            return await productModel.paginate(query, options)
        }catch(err){
            return new Error(err)
        }
    }

    async getProductById(pid){
        try{
            return await productModel.findOne({_id: pid})
        }catch(err){
            return new Error(err)
        }
    }

    async addProduct(product){
        try{
            const result = await productModel.create(product)
            return result
        }catch(err){
            return new Error(err)
        }
    }

    async updateProduct(pid, product){
        try{
            return await productModel.updateOne({_id: pid}, product)
        }catch(err){
            return new Error(err)
        }
    }

    async deleteProduct(pid){
        try{
            return await productModel.deleteOne({_id: pid})
        }catch(err){
            return new Error(err)
        }
    }
}

export default ProductManagerMongo
import ProductDto from '../dto/product.dto.js'

class ProductRepository{
    constructor(dao){
        this.dao = dao
    }

    async create(product){
        const productToAdd = new ProductDto(product)
        const result = this.dao.addProduct(productToAdd)
        return result
    }

    async get(query, options){
        const result = this.dao.getProducts(query, options)
        return result
    }

    async getById(pid){
        const result = this.dao.getProductById(pid)
        return result
    }

    async update(pid, product){
        const result = this.dao.updateProduct(pid, product)
        return result
    }

    async delete(pid){
        const result = this.dao.deleteProduct(pid)
        return result
    }
}

export default ProductRepository
import ProductDto from '../../dto/product.dto.js'

class ProductRepository{
    constructor(dao){
        this.dao = dao
    }

    async create(product){
        const productToAdd = new ProductDto(product)
        const result = this.dao.create(productToAdd)
        return result
    }

    async get(query, options){
        const result = this.dao.get(query, options)
        return result
    }

    async getById(pid){
        const result = this.dao.getById(pid)
        return result
    }

    async update(pid, product){
        const result = this.dao.update(pid, product)
        return result
    }

    async delete(pid){
        const result = this.dao.delete(pid)
        return result
    }
}

export default ProductRepository
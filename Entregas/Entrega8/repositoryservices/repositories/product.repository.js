class ProductRepository
{
    constructor(dao)
    {
        this.dao = dao
    }

    async create(product)
    {
        return this.dao.create(product)
    }

    async get(query, options)
    {
        return this.dao.get(query, options)
    }

    async getById(pid)
    {
        return this.dao.getById(pid)
    }

    async update(pid, product){
        const result = this.dao.update(pid, product)
        return result
    }

    async delete(pid)
    {
        return this.dao.delete(pid)
    }
}

export default ProductRepository
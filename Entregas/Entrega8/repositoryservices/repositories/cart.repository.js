class CartRepository{
    constructor(dao){
        this.dao = dao
    }

    async create(){
        const result = await this.dao.createCart()
        return result
    }

    async add(cid, pid){
        const result = await this.dao.addProductToCart(cid, pid)
        return result
    }

    async get(){
        const result = await this.dao.getCarts()
        return result
    }

    async getById(cid){
        const result = await this.dao.getCartById(cid)
        return result
    }

    async update(cid, products)
    {
        console.log(cid)
        console.log(products)
        const result = await this.dao.updateCart(cid, products)
        return result
    }

    async updateQuantity(cid, pid, quantity){
        console.log(cid)
        console.log(pid)
        console.log(quantity)
        const result = await this.dao.updateQuantity(cid, pid, quantity)
        return result
    }

    async delete(cid, pid){
        const result = await this.dao.deleteProductFromCart(cid, pid)
        return result
    }

    async deleteAll(cid){
        const result = await this.dao.deleteAllProductsFromCart(cid)
        return result
    }
}

export default CartRepository
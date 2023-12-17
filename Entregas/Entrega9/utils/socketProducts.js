import { productManager } from './../dao/mongo/ProductManager.js'

const socketProduct = async (io) => {
    const products = await productManager.get()

    io.on('connection', socket => {

        socket.emit('products', products)

        socket.on('addProduct', async data => {
            await productManager.create(data)
            const products = await productManager.get()
            socket.emit('products', products)
        })

        socket.on('deleteProduct', async data => {
            await productManager.delete(data)
            const products = await productManager.get()
            socket.emit('products', products)
        })
    })
}

export default socketProduct
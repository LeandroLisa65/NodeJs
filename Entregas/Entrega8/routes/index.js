import express from 'express'
import ProductRouter from './products.router.js'
import CartRouter from './cart.router.js'

import errorHandler from '../middlewares/errorResponder.js'

const productRouter = new ProductRouter()
const cartRouter = new CartRouter()

const mainRouter = express.Router()

mainRouter.use('/api/products', productRouter.getRouter())
mainRouter.use('/api/carts', cartRouter.getRouter())

mainRouter.use(errorHandler)

export default mainRouter
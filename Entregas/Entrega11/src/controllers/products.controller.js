import { logger } from '../config/logger.js'
import { productService } from '../repositories/index.js'
import  CustomError from '../utils/CustomErrors/CustomError.js'
import EErrors from '../utils/CustomErrors/EErrors.js'
import { generateProductErrorInfo } from '../utils/CustomErrors/info.js'
import transport from '../utils/nodemailer.js'

class ProductController {
    get = async (req, res) => {
        try{
            let queryPage = ''
            if (req.query.page) {
                queryPage = parseInt(req.query.page);
                if (isNaN(queryPage) || queryPage < 1) {
                    throw new Error('Invalid page number');
                }
            }
    
            let query = {}
            if(req.query.query === undefined){ // query undefined
                query = {}
            }else if(req.query.query === 'true'){ // status === true
                query.status = true
            }else if(req.query.query === 'false'){ // status === false
                query.status = false
            }else{ // category === req.query.params
                query.category = req.query.query
            }
    
            let sort = null
            if (req.query.sort === "asc") { // asc or desc
                sort = { price: 1 };
            } else if (req.query.sort === "desc") {
                sort = { price: -1 };
            }
    
            const options = {
                limit: req.query.limit ? parseInt(req.query.limit) : 10,
                page: req.query.page ? parseInt(req.query.page) : 1,
                sort: sort
            }
            
            let prevLink = ''
            let nextLink = ''
    
            const products = await productService.get(query, options)
            const { docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage } = products

            if(query.status !== undefined){
                hasPrevPage === false ? prevLink = null : prevLink = `/products?page=${parseInt(prevPage)}&limit=${options.limit}&sort=${req.query.sort}&query=${query.status}`
                hasNextPage === false ? nextLink = null : nextLink = `/products?page=${parseInt(nextPage)}&limit=${options.limit}&sort=${req.query.sort}&query=${query.status}`
            }else if(query.category !== undefined){
                hasPrevPage === false ? prevLink = null : prevLink = `/products/${query.category}?page=${parseInt(prevPage)}&limit=${options.limit}&sort=${req.query.sort}`
                hasNextPage === false ? nextLink = null : nextLink = `/products/${query.category}?page=${parseInt(nextPage)}&limit=${options.limit}&sort=${req.query.sort}`
            }else{
                hasPrevPage === false ? prevLink = null : prevLink = `/products?page=${parseInt(prevPage)}&limit=${options.limit}&sort=${req.query.sort}`
                hasNextPage === false ? nextLink = null : nextLink = `/products?page=${parseInt(nextPage)}&limit=${options.limit}&sort=${req.query.sort}`
            }
            return { products: docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage, prevLink, nextLink, session: req.user }
        }catch(error){
            throw error
        }
    }

    getById = async (req, res) => {
        try{
            const product = await productService.getById(req.params.pid)
            return { product }
        }catch(error){
            throw error
        }
    }

    create = async (req, res, next) => {
        try{
            const product = req.body

            req.user.user.role === 'premium' ? product.owner = req.user.user.email : product.owner = 'admin'

            if(!product.title || !product.price || !product.code || !product.stock){
                CustomError.createError({
                    name: 'Product creation error',
                    cause: generateProductErrorInfo({title: product.title, code: product.code, price: product.price, stock: product.stock}),
                    message: 'Error trying to create a product',
                    code: EErrors.INVALID_TYPE_ERROR
                })
            }

            const addedProduct = await productService.create(product)
            return addedProduct
        }catch (error){
            next(error)
        }
    }

    update = async (req, res) => {
        try{
            const product = req.body

            if(req.user.user.role === 'premium' && req.user.user.email !== product.owner){
                res.send({status: 'error', message: "You can't update products you don't own"})
            }

            const updatedProduct = await productService.update(req.params.pid, product)
            return { updatedProduct }
        }catch (error){
            throw error
        }
    }

    delete = async (req, res) => {
        try{
            const product = await productService.getById(req.params.pid)

            if(req.user.user.role === 'premium' && req.user.user.email !== product.owner){
                res.send({status: 'error', message: "You can't delete products you don't own"})
            }

            const deletedProduct = await productService.delete(req.params.pid)
            
            if(req.user.user.role === 'admin' && 'admin' !== product.owner){
                await transport.sendMail({
                    from: 'Product deleted',
                    to: product.owner,
                    subject: 'Product deleted',
                    html: `
                    <div>
                        <h1>Your product: ${product.title} has been deleted by an admin</h1>
                    </div>
                    `
                })
            }
            return { deletedProduct }
        }catch(error){
            throw error
        }
    }
}

const productController = new ProductController()
export default productController
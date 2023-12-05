import { productService } from '../repositoryservices/index.js'
import CustomError from '../utils/CustomErrors/CustomError.js'
import EErrors from '../utils/CustomErrors/EErrors.js'
import { generateProductErrorInfo }from '../utils/CustomErrors/info.js'
class ProductController {
    get = async (req, res, next) => {
        try
        {
            let queryPage = ''
            if (req.query.page) {
                queryPage = parseInt(req.query.page);
                if (isNaN(queryPage) || queryPage < 1) {
                    throw new Error('Invalid page number');
                }
            }

            let query = {}

            switch (true) {
                case req.query.query === 'true':
                case req.query.query === 'false':
                    query.status = req.query.query === 'true';
                    break;
                case req.query.query !== 'true' && req.query.query !== 'false':
                    query.category = req.query.query;
                    break;
                default:
                    break;
            }
    
            let sort = null
            if (req.query.sort === "asc" || req.query.sort === "desc")
                sort = req.query.sort === "asc" ? { price: 1 } : { price: -1 };
    
            const options = {
                limit: req.query.limit ? parseInt(req.query.limit) : 10,
                page: req.query.page ? parseInt(req.query.page) : 1,
                sort: sort
            }
            
            let prevLink = ''
            let nextLink = ''
    
            const products = await productService.get(query, options)
            console.log(products)
            const { docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage } = products

            this.#setPreviousPage(hasPrevPage, prevLink, prevPage, options, req, query);
            this.#setNextPage(hasNextPage, nextLink, nextPage, options, req, query);

            return { products: docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage, prevLink, nextLink, session: req.user }
        }
        catch(error)
        {
            throw error
        }
    }

    #queryBuilder = (page, options, req) => {
        return `/products?page=${parseInt(page)}&limit=${options.limit}&sort=${req.query.sort}`;
    }

    #setPreviousPage = (hasPrevPage, prevLink, prevPage, options, req, query) => {
        switch (true) {
            case query.status !== undefined:
                hasPrevPage === false ? prevLink = null : prevLink = `${this.#queryBuilder(prevPage, options, req)}&query=${query.status}`
                break;
            case query.category !== undefined:
                hasPrevPage === false ? prevLink = null : prevLink = `${this.#queryBuilder(prevPage, options, req)}&query=${query.category}`
                break;
            default:
                hasPrevPage === false ? prevLink = null : prevLink = `${this.#queryBuilder(prevPage, options, req)}`
                break;
        }
    }

    #setNextPage = (hasNextPage, nextLink, nextPage, options, req, query) => {
        switch (true) {
            case query.status !== undefined:
                hasNextPage === false ? nextLink = null : nextLink = `${this.#queryBuilder(nextPage, options, req)}&query=${query.status}`
                break;
            case query.category !== undefined:
                hasNextPage === false ? nextLink = null : nextLink = `${this.#queryBuilder(nextPage, options, req)}&query=${query.category}`
                break;
            default:
                hasNextPage === false ? nextLink = null : nextLink = `${this.#queryBuilder(nextPage, options, req)}`
                break;
        }
    }

    getById = async (req, res, next) => {
        try
        {
            return { product: await productService.getById(req.params.pid) }
        }
        catch(error)
        {
            throw error
        }
    }

    create = async (req, res, next) => {
        try
        {
            const product = req.body

            if(!product.title || !product.description || !product.price || !product.code || !product.stock || !product.category || !product.status)
            {
                CustomError.createError({
                    name: 'Product error',
                    cause: generateProductErrorInfo({title: product.title, code: product.code, description: product.description, price: product.price, stock: product.stock, category: product.category, status: product.status}),
                    message: 'Error trying to create a product',
                    code: EErrors.INVALID_TYPE_ERROR
                })
            }

            return await productService.create(product)
        }
        catch(error)
        {
            next(error)
        }
    }

    update = async (req, res, next) => {
        try
        {
            return await productService.update(req.params.pid, req.body)
        }
        catch (error)
        {
            throw error
        }
    }

    delete = async (req, res, next) => {
        try
        {           
            return await productService.delete(req.params.pid)
        }
        catch(error)
        {
            throw error
        }
    }
}

const productController = new ProductController();

export default productController;
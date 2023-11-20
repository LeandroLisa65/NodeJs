import { Router } from 'express';
import { productManager } from '../dao/Dao/MongoDb/ProductManager.js';

const router = Router();

router.get('/',async (req,res, next) => {
    try {
        let queryPage = ''
        if (req.query.page) {
            queryPage = parseInt(req.query.page);
            if (isNaN(queryPage) || queryPage < 1) {
                throw new Error('Invalid page number');
            }
        }

        let query = {};

        if(req.query.query === undefined)
        { // query undefined
            query = {}
        }
        else if(req.query.query === 'true')
        { // status === true
            query.status = true
        }else if(req.query.query === 'false')
        { // status === false
            query.status = false
        }else
        { // category === req.query.params
            query.category = req.query.query
        }

        let sort = req.query.sort == undefined ? { price: 1 } : { price: -1 };

        if (req.query.sort === "asc") 
        { // asc or desc
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

        const products = await productManager.getProducts(query, options)
        const { docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage } = products

        if(query.status !== undefined){ // if query.status exists
            hasPrevPage === false ? prevLink = null : prevLink = `/api/views/products?page=${parseInt(prevPage)}&limit=${options.limit}&sort=${req.query.sort}&query=${query.status}`
            hasNextPage === false ? nextLink = null : nextLink = `/api/views/products?page=${parseInt(nextPage)}&limit=${options.limit}&sort=${req.query.sort}&query=${query.status}`
        }else if(query.category !== undefined){ // if query.category exists
            hasPrevPage === false ? prevLink = null : prevLink = `/api/views/products/${query.category}?page=${parseInt(prevPage)}&limit=${options.limit}&sort=${req.query.sort}`
            hasNextPage === false ? nextLink = null : nextLink = `/api/views/products/${query.category}?page=${parseInt(nextPage)}&limit=${options.limit}&sort=${req.query.sort}`
        }else{ // if there isn't query values
            hasPrevPage === false ? prevLink = null : prevLink = `/api/views/products?page=${parseInt(prevPage)}&limit=${options.limit}&sort=${req.query.sort}`
            hasNextPage === false ? nextLink = null : nextLink = `/api/views/products?page=${parseInt(nextPage)}&limit=${options.limit}&sort=${req.query.sort}`
        }
        res.status(200).json({message:'Products found', products: { products: docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage, prevLink, nextLink}})
    }
    catch(error)
    {
        next(error);
    }
})

router.get('/:pid',async (req, res, next)=>{
    try {
    const {pid} = req.params;
    const response = await productManager.getProductById(pid);
    if(!response)
        res.status(404).json({message:response});
    res.status(200).json({message:'Product found', product: response})
    }
    catch(error)
    {
        next(error);
    }
})

router.post('/',async (req, res, next)=>{
    try {
    const {title, description, code, price, status, stock, category} = req.body;
    if(!title || !description || !price || !code || !status || !stock || !category)
        res.status(404).json({message: "Some data is missing"});
    const response = await productManager.createProduct(req.body);
    res.status(200).json({message:response});
    }
    catch(error)
    {
        next(error);
    }
})

router.put('/:pid',async (req, res, next)=>{
    try {
    const {pid} = req.params;
    const product = req.body;
    const response = await productManager.updateProduct(pid, product);
    res.json({message:response});
    }
    catch(error)
    {
        next(error);
    }
})

router.delete('/:pid',async (req, res, next)=>{
    try {
        const {pid} = req.params;
        const response = await productManager.deleteProduct(pid);
        res.json({message:response});
    }
    catch(error)
    {
        next(error);
    }
})

export default router;
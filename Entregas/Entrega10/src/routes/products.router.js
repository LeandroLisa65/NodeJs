import RouterClass from './RouterClass.js'
import productController from '../controllers/products.controller.js'

class ProductRouter extends RouterClass {
    init(){
        this.get('/', ['PUBLIC'], async (req, res) => {
            try{
                console.log('here2')
                res.sendSuccess(await productController.get(req, res))
            }catch(error){
                res.sendServerError(error.message)
            }
        })

        this.get('/:pid', ['PUBLIC'], async (req, res) => {
            try{
                res.sendSuccess(await productController.getById(req, res))
            }catch(error){
                res.sendServerError(error.message)
            }
        })

        this.post('/', ['ADMIN', 'PREMIUM'], async (req, res, next) => {
            try{
                res.sendSuccess(await productController.create(req, res, next))
            }catch(error){
                // errorHandler
            }
        })

        this.put('/:pid', ['ADMIN', 'PREMIUM'], async (req, res) => {
            try{
                res.sendSuccess(await productController.update(req, res))
            }catch(error){
                res.sendServerError(error.message)
            }
        })

        this.delete('/:pid', ['ADMIN', 'PREMIUM'], async (req, res) => {
            try{
                res.sendSuccess(await productController.delete(req, res))
            }catch(error){
                res.sendServerError(error.message)
            }
        })
    }
}

const productRouter = new ProductRouter()
export default ProductRouter;
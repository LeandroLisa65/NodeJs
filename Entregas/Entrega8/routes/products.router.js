import productController  from '../controllers/products.controller.js';
import RouterClass from './RouterClass.js'
class ProductRouter extends RouterClass {
    init(){
        this.get('/', ['PUBLIC'], async (req, res) => {
            try{
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

        this.post('/', ['PUBLIC'], async (req, res, next) => {
            try{
                res.sendSuccess(await productController.create(req, res, next))
            }catch(error){
                // errorHandler
            }
        })

        this.put('/:pid', ['PUBLIC'], async (req, res) => {
            try{
                res.sendSuccess(await productController.update(req, res))
            }catch(error){
                res.sendServerError(error.message)
            }
        })

        this.delete('/:pid', ['PUBLIC'], async (req, res) => {
            try{
                res.sendSuccess(await productController.delete(req, res))
            }catch(error){
                res.sendServerError(error.message)
            }
        })
    }
}


export default ProductRouter;
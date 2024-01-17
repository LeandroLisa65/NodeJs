import productController from '../controllers/products.controller.js'
import cartController from '../controllers/carts.controller.js'
import { authToken } from '../utils/jwt.js'
import RouterClass from './RouterClass.js'


class ViewRouter extends RouterClass {
    init(){
        this.get('/realtimeproducts', ['ADMIN'], authToken, async (req, res) => {
            res.render('realTimeProducts', {})
        })

        this.get('/chat', ['PUBLIC'], authToken, async (req, res) => {
            res.render('chat', {})
        })

        this.get('/products', ['PUBLIC'], authToken, async (req, res) => {
           try{
                console.debug('products')
                const result = await productController.get(req, res)
                const { products, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage, prevLink, nextLink, session  } = result
                res.render('products', {status: 'success', payload: products, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage, prevLink, nextLink, session })
            }catch(error){
                res.sendServerError(error.message)
            }
        })

        this.get('/cart/:cid', ['PUBLIC'], authToken, async (req, res) => {
            res.render('cart', {status: 'succes', payload: await cartController.getById(req, res)})
        })

        this.get('/login', ['PUBLIC'], async (req, res) => {
            res.render('login', {})
        })

        this.get('/recoverPassword', ['PUBLIC'], async (req, res) => {
            res.render('recoverpassword', {})
        })

        this.get('/register', ['PUBLIC'], async (req, res) => {
            res.render('register', {})
        })

        this.get('/multer', ['USER', 'PREMIUM'], async (req, res) => {
            res.render('multer', {user: req.user.user})
        })
    }
}

const viewRouter = new ViewRouter()
export default ViewRouter
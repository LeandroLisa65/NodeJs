import productController from './../controllers/products.controller.js'
import cartController from './../controllers/carts.controller.js'
import { authToken, authTokenResetPassword } from './../utils/jwt.js'
import RouterClass from './RouterClass.js'


class ViewRouter extends RouterClass {
    init(){

        this.get('/chat', ['PUBLIC'], authToken, async (req, res) => {
            res.render('chat', {})
        })

        this.get('/products', ['PUBLIC'], authToken, async (req, res) => {
           try{
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

        this.get('/recover', ['PUBLIC'], async (req, res) => {
            console.log(('recover'));
            res.render('recover', {})
        })

        this.get('/updatePassword/:token', ['PUBLIC'], authTokenResetPassword, async (req, res) => {
            res.render('updatePassword', {token: req.params.token})
        })

        this.get('/register', ['PUBLIC'], async (req, res) => {
            res.render('register', {})
        })
    }
}

export default ViewRouter
import passport from 'passport'
import RouterClass from './RouterClass.js'
import userController from '../controllers/users.controller.js'
import { generateToken } from '../utils/jwt.js'
import uploader from '../utils/multer.js'
 
const authenticateJWT = passport.authenticate('current', { session: false });
const authenticateGithub = passport.authenticate('github', { session: false })

class SessionRouter extends RouterClass {
    init(){
        this.get('/', ['ADMIN'], authenticateJWT, async (req, res) => {
            try{
                res.sendSuccess(await userController.getUsers(req, res))
            }catch(error){
                res.sendServerError(error.message)
            }
        })

        this.get('/current', ['PUBLIC'], authenticateJWT,  async (req, res) => {
            try{
                res.sendSuccess(await userController.current(req, res))
            }catch(error){
                res.sendServerError(error.message)
            }
        })

        this.post('/register', ['PUBLIC'], async (req, res, next) => {
            try{
                res.sendSuccess(await userController.register(req, res, next))
            }catch(error){
                // errorHandler
            }
        })

        this.post('/login', ['PUBLIC'], async (req, res) => {
            try{
                res.sendSuccess(await userController.login(req, res))
            }catch(error){
                res.sendServerError(error.message)
            }
        })

        this.get('/logout', ['PUBLIC'], async (req, res) => {
            try{
                res.sendSuccess(await userController.logout(req, res))
            }catch(error){
                res.sendServerError(error.message)
            }
        })

        this.post('/recover', ['PUBLIC'], async (req, res) => {
            try{
                res.sendSuccess(await userController.recoverPassword(req, res))
            }catch(error){
                res.sendServerError(error.message)
            }
        })

        this.post('/updatepassword', ['PUBLIC'], async (req, res) => {
            try{
                res.sendSuccess(await userController.updatePassword(req, res))
            }catch(error){
                res.sendServerError(error.message)
            }
        })

        this.get('/premium/:uid', ['USER', 'PREMIUM'], async (req, res) => {
            try{
                res.sendSuccess(await userController.premiumUser(req, res)) 
            }catch(error){
                res.sendServerError(error.message)
            }
        })

        this.delete('/', ['ADMIN'], authenticateJWT, async (req, res) => {
            try{
                res.sendSuccess(await userController.inactiveUsers(req, res))
            }catch(error){
                res.sendServerError(error.message)
            }
        })

        this.get('/google', ['PUBLIC'],authenticateGithub, async (req, res)=>{})

        this.get('/googlecallback', ['PUBLIC'], authenticateGithub,  async (req, res) => {
            try{
                const user = req.user
                const token = generateToken(user)
                res.cookie(process.env.JWT_COOKIE_KEY, token, {maxAge: 3600000, httpOnly: false, sameSite: 'none', secure: true})
                res.redirect('/products')
            }catch(error){
                res.sendServerError(error.message)
            }
        })
    }
}

const usersRouter = new SessionRouter();
export default SessionRouter;
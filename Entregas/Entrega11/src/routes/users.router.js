import passport from 'passport'
import RouterClass from './RouterClass.js'
import userController from '../controllers/users.controller.js'
 
const authenticateJWT = passport.authenticate('current', { session: false });
const authenticateGithub = passport.authenticate('github', { session: false })

class SessionRouter extends RouterClass {
    init(){
        this.get('/', ['PUBLIC'], authenticateJWT, async (req, res) => {
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

        this.post('/updatepassword', ['PUBLIC'], async (req, res) => {
            try{
                res.sendSuccess(await userController.updatePassword(req, res))
            }catch(error){
                res.sendServerError(error.message)
            }
        })

        this.post('/recoverpassword', ['PUBLIC'], async (req, res) => {
            try{
                res.sendSuccess(await userController.recoverPassword(req, res))
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
    }
}

const usersRouter = new SessionRouter();
export default SessionRouter;
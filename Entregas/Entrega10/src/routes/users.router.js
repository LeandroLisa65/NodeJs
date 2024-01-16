import passport from 'passport'
import RouterClass from './RouterClass.js'
import userController from '../controllers/users.controller.js'
 
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

        this.delete('/', ['ADMIN'], authenticateJWT, async (req, res) => {
            try{
                res.sendSuccess(await userController.inactiveUsers(req, res))
            }catch(error){
                res.sendServerError(error.message)
            }
        })

    }
}

const usersRouter = new SessionRouter();
export default SessionRouter;
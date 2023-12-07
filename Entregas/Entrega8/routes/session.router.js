import RouterClass from './RouterClass.js'
import userController  from '../controllers/users.controller.js';
import passport from 'passport'

const authenticateJWT = passport.authenticate('current', { session: false });
class SessionRouter extends RouterClass {
  init()
  {
      this.get('/', ['PUBLIC'], async (req, res) => {
          try{
              res.sendSuccess(await userController.getUsers(req, res))
          }catch(error){
              res.sendServerError(error.message)
          }
      })

      this.get('/current', ['PUBLIC'], async (req, res) => {
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
  }
}

export default SessionRouter;
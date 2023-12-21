/*import RouterClass from './RouterClass.js'
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

      this.get('/current', ['PUBLIC'], authenticateJWT, async (req, res) => {
          try{
              res.sendSuccess(userController.current(req, res))
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

      this.post('/recover', ['PUBLIC'], async (req, res) => {
        try{
            res.sendSuccess(await userController.updatePassword(req, res))
        }catch(error){
            res.sendServerError(error.message)
        }
    });
  }
}

export default SessionRouter;*/


import { Router } from "express";
import RouterClass from './RouterClass.js'
import userController  from '../controllers/users.controller.js';
import passport from 'passport'

//const authenticateJWT = passport.authenticate('current', { session: false });
const router = Router();
//class SessionRouter extends RouterClass {
  //init()
  //{
      router.get('/',  async (req, res) => {
          try{
              res.sendSuccess(await userController.getUsers(req, res))
          }catch(error){
              res.sendServerError(error.message)
          }
      })

      router.get('/current',   async (req, res) => {
          try{
              res.sendSuccess(userController.current(req, res))
          }catch(error){
              res.sendServerError(error.message)
          }
      })

      router.post('/signup',  async (req, res, next) => {
          try{
            const result = await userController.register(req, res, next)
            console.log(result)
            if(result)
              res.sendSuccess(result)
            else
            {
            res.send('existing user')
            }
          }catch(error){
              // errorHandler
          }
      })

      router.post('/login',  async (req, res) => {
          try{
              res.sendSuccess(await userController.login(req, res))
          }catch(error){
              res.sendServerError(error.message)
          }
      })

      router.post('/recover',  async (req, res) => {
        try{
            res.sendSuccess(await userController.updatePassword(req, res))
        }catch(error){
            res.sendServerError(error.message)
        }
    });
  //}
//}

export default router;

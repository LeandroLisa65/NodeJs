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


/*import { Router } from "express";
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

export default router;*/

import { Router } from 'express';
import { userManager } from '../dao/mongo/UserManager.js';
import { generateToken } from './../utils/jwt.js';
import { hashData, compareData } from './../utils/bcrypt.js'
//import passport from '../passport.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post("/signup", async (req, res) => {

    const { first_name, last_name, email, password, age } = req.body;
    if (!first_name || !last_name || !email || !password || !age) {
      return res.status(400).json({ message: "All fields are required" });
    }
    try {
      const hashedPassword = await hashData(password);
      const createdUser = await userManager.addUser({
        ...req.body,
        password: hashedPassword,
        role: "User",
      });

      res.status(200).json({ message: "User created", user: createdUser });
    } catch (error) {
      res.status(500).json({ error });
    }
  });
  
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    try {
      const user = await userManager.getUserByEmail(email);
      if (!user) {
        return res.redirect("/signup");
      }

      const isPasswordValid = await compareData(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Password is not valid" });
      }
  
      const token = generateToken({ user });

      res
        .status(200)
        .cookie("token", token, { httpOnly: true })
        .json({ message: "Bienvenido", token });
    } catch (error) {
      res.status(500).json({ error });
    }
  });

router.get('/profile', (req, res) => {
    if(!req.session.user)
        return res.redirect('/api/views/login');

    res.render('profile', {user: req.session.user});
});

router.get('/signout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/api/views/login');
    })
});

router.post('/recover', async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password)
        res.status(404).json({message: 'All fields are required'});
    
    try {
        const user = await userManager.getUserByEmail(email);
        
        if(!user)
            return res.redirect('/api/views/login')

        const hashedPassword = await hashData(password);
        
        user.password = hashedPassword;
        await user.save();
        return res.status(200).send({message: "Password update"});
    } catch (error) {
        throw error;
    }
});

router.get('/current'
,  async (req, res) => {
  try{
    const user = req.user;
    console.log('user' + user);

    res.json( { message: "Current User", user: user });
  }catch(error){
      res.json(error.message)
  }
})

export default router;
import { Router } from 'express';
import { userManager } from '../dao/mongo/UserManager.js';
import { hashData, isPasswordValid, generateToken } from '../utils.js';
import passport from '../config/passport.js';
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

      if (!await isPasswordValid(password, user.password)) {
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

/*
router.post('/signup', async (req, res) => {
    const {first_name, last_name, email, password} = req.body;

    if(!first_name || !last_name || !email || !password)
        res.status(400).json({message: 'All fields are required'});
    
    try {
        const hashedPassword = hashData(password);
        const createdUser = await userManager.addUser({ ...req.body, password: hashPassword });
        
        res.status(200).json({message:'User created', user: createdUser})
    } catch (error) {
        console.log(error);
        throw error;
    }
});

router.post('/login', async (req, res) => {

    const {email, password} = req.body;

    if(!email || !password)
        res.status(404).json({message: 'All fields are required'});
    
    try {
        const user = await userManager.getUserByEmail(email);
        if(!user)
            return res.redirect('/api/views/signup')
        
        const isPasswordValid = compareData(password, user.password);

        if(!isPasswordValid)
            return res.status(401).json({message: 'Password invalid'});

        const isAdmin = email == 'adminCoder@coder.com' && password == 'adminCod3r123';
        const rol = isAdmin ? 'Admin' : 'Usuario'
        req.session.user = {email : user.email, first_name: user.first_name, rol: rol};
        return res.redirect('/api/views/products')
    } catch (error) {
        console.log(error);
        throw error;
    }
});
*/

//local
/*router.post(
    "/signup",
    passport.authenticate("signup", {
      successRedirect: "/",
      failureRedirect: "/api/views/error",
    })
  );
  
  router.post(
    "/login",
    passport.authenticate("login", {
      successRedirect: '/api/views/products',
      failureRedirect: "/api/views/error",
    })
  );*/
  
//github
router.get("/auth/github",passport.authenticate('github'));
  
router.get("/callback", passport.authenticate('github'), (req, res) => {
res.redirect("/api/views/products");
});

//google
router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  
router.get(
"/auth/google/callback",
passport.authenticate("google", { failureRedirect: "/api/views/error" }),
(req, res) => {
    console.log(req);
    res.redirect("/api/views/products");
}
);

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
, authMiddleware(['PUBLIC'])
, passport.authenticate('current', { session: false })
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
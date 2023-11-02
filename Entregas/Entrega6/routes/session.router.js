import { Router } from 'express';
import { userManager } from '../dao/Dao/MongoDb/UserManager.js';
const router = Router();

router.get('/',async (req,res, next) => {
})

router.post('/signup', async (req, res) => {
    const {first_name, last_name, email, password} = req.body;

    if(!first_name || !last_name || !email || !password)
        res.status(404).json({message: 'Al fields are required'});
    
    try {
        const createdUser = await userManager.addUser(req.body);
        
        res.status(200).json({message:'User created', user: createdUser})
    } catch (error) {
        throw new Error(error);
    }
});

router.post('/login', async (req, res) => {
    if(req.session.user)
        return res.redirect('/profile');

    const {email, password} = req.body;

    if(!email || !password)
        res.status(404).json({message: 'Al fields are required'});
    
    try {
        const user = await userManager.getUserByEmail(email);
        if(!user)
            return res.redirect('/signup')
        
            const isPasswordValid = password === user.password;

            if(!isPasswordValid)
                return res.status(401).json({message: 'Password not valid'});

            const isAdmin = email == 'adminCoder@coder.com' && password == 'adminCod3r123';
            req.session.user = {email : user.email, first_name: user.first_name, isAdmin: isAdmin};
            return res.status(200).redirect('/profile', {user: req.session.user})
    } catch (error) {
        throw new Error(error);
    }
});

router.get('/profile', (req, res) => {
    if(!req.session.user)
        return res.redirect('/login');

    res.render('profile', {user: req.session.user});
});

router.get('/signout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    })
});

export default router;
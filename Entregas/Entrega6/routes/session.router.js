import { Router } from 'express';
import { userManager } from '../dao/Dao/MongoDb/UserManager.js';
const router = Router();

router.post('/signup', async (req, res) => {
    const {first_name, last_name, email, password} = req.body;

    if(!first_name || !last_name || !email || !password)
        res.status(400).json({message: 'All fields are required'});
    
    try {
        const createdUser = await userManager.addUser(req.body);
        
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
        
        const isPasswordValid = password === user.password;

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

export default router;
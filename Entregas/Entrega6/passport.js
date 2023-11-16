import passport from "passport";
import { userManager } from './dao/Dao/MongoDb/UserManager.js';
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { hashData, compareData } from "./utils.js";

passport.use('signup', new LocalStrategy
(
    {
        passReqToCallback: true
        , usernameField: 'email'
        , passwordField: 'password'
    }
    , async (req, email, password, done) => {

    const {first_name, last_name } = req.body;

    if(!first_name || !last_name || !email || !password)
        return done(null, false);
    
    try {
        const hashedPassword = await hashData(password);
        const createdUser = await userManager.addUser({ ...req.body, password: hashedPassword });

        return done(null, createdUser);
    } catch (error) {
        done(error);
    }
}));

passport.use(
  'login'
  , new LocalStrategy(
    {
    passReqToCallback: true
    , usernameField: 'email'
    }
    , async (req, email, password, done) => {
    try {
        
        if(!email || !password)
            res.status(404).json({message: 'All fields are required'});
    
        const user = await userManager.getUserByEmail(email);

        if(!user)
            return done(null, false);
        
        const isPasswordValid = compareData(password, user.password);

        if(!isPasswordValid)
            return done(null, false);

        const isAdmin = email == 'adminCoder@coder.com' && password == 'adminCod3r123';
        const rol = isAdmin ? 'Admin' : 'Usuario'

        return done(null, user);
    } catch (error) {
        done(error);
    }
}));

passport.use(
    'github',
    new GithubStrategy(
      {
        clientID: "Iv1.da286efddf237130",
        clientSecret: "e1531c90402b8c7d75399363092133df3638e48c",
        callbackURL: "http://localhost:8080/api/session/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {

          const user = await userManager.getUserByEmail(profile._json.email);

          if (user) {
            return handleLogin(user, done, 'isGithub');
          }
          
          const infoUser = signupGithub(profile);
          const createdUser = await userManager.addUser(infoUser);
          const isAdmin = createdUser.email == 'adminCoder@coder.com';
          const rol = isAdmin ? 'Admin' : 'Usuario';
          console.log(createdUser);
          done(null, {first_name: createdUser.first_name, email: createdUser.email, rol: rol});
        } catch (error) {
          done(error);
        }
      }
    )
  );

passport.serializeUser( (user,done) => {
    done(null,user._id);
});

passport.deserializeUser((id,done) => {
try {
    const user = userManager.getUserById(id);
    done(null, user)
} catch (error) {
    done(error)
}
});

const handleLogin = (user, done, property) => {

  if (user[property]) {
    const isAdmin = user.email == 'adminCoder@coder.com';
    const rol = isAdmin ? 'Admin' : 'Usuario'
    user.rol = rol;
    return done(null, user);
  } else {
    return done(null, false);
  }
}

const signupGithub = (profile) => {
  let name = '';
  let last_name = '';
  let email = ' ';

  if(profile._json.name)
    {
      if(profile._json.name.indexOf(' ') >= 0)
      {
        let names = profile._json.name.split(' ');
        name = names[0];
        last_name = names[1];
      }
      else
        name = profile._json.name;
    }

  if(profile._json.email)
    email = profile._json.email;

  return {
    first_name: name,
    last_name: last_name,
    email: email,
    password: " ",
    isGithub: true,
  };
}

export default passport;
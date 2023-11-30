import passport from "passport";
import { userManager } from '../dao/mongo/UserManager.js';
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { hashData, isPasswordValid } from "./utils.js";

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
        
        if(!isPasswordValid(password, user.password))
            return done(null, false);

        const isAdmin = email == 'adminCoder@coder.com' && password == 'adminCod3r123';
        const rol = isAdmin ? 'Admin' : 'Usuario'

        return done(null, user);
    } catch (error) {
        done(error);
    }
}));

/*passport.use(
  'github',
  new GithubStrategy(
    {
      clientID: "Iv1.da286efddf237130",
      clientSecret: "e1531c90402b8c7d75399363092133df3638e48c",
      callbackURL: "http://localhost:8080/api/session/callback",
      scope: ['user:email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await userManager.getUserByEmail(profile._json.email)
        if(!user){
            let newUser = signupGithub(profile);
            const result = await userManager.addUser(newUser)
            return done(null, result)
        }
        
        return done(null, user)
        
      } catch (error) {
        done(error);
      }
    }
  )
);*/

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: "239873728044-rsa4iqjntsgd5a7testsoj7evifdqv1g.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:8080/api/session/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const user = await userManager.getUserByEmail(profile._json.email)
        if(!user){
            let newUser = signupGoogle(profile);
            const result = await userManager.addUser(newUser)
            return done(null, result)
        }
        
        return done(null, user)
      } catch (error) {
        done(error);
      }
    }
  )
);

const cookieExtractor = req => {

  if (req && req.cookies)
      return req.cookies.token;
  
  return null;
};


passport.use('current', new JWTStrategy(
  {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: "secretJWT",
  }
, async (jwt_payload, done) => {
    try{
      console.log(jwt_payload)
      return done(null, jwt_payload.user);
    }catch(error){
        return done(error);
    }
}))


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

/*const signupGithub = (profile) => {
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
}*/

const signupGoogle = (profile) => {
  return {
    first_name: profile._json.given_name,
    last_name: profile._json.family_name,
    email: profile._json.email,
    password: " ",
    isGoogle: true,
  };
}

export default passport;
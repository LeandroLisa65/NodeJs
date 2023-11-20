import passport from "passport";
import { userManager } from './dao/Dao/MongoDb/UserManager.js';
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
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
  );

  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID:
          "663921714149-q3f5pa628qj80g0inlj0sntv43uhcglb.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:8080/api/session/auth/google/callback",
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          const userDB = await usersManager.findByEmail(profile._json.email);
          // login
          if (userDB) {
            if (userDB.isGoogle) {
              return done(null, userDB);
            } else {
              return done(null, false);
            }
          }
          // signup
          const infoUser = {
            first_name: profile._json.given_name,
            last_name: profile._json.family_name,
            email: profile._json.email,
            password: " ",
            isGoogle: true,
          };
          const createdUser = await usersManager.createOne(infoUser);
          done(null, createdUser);
        } catch (error) {
          done(error);
        }
      }
    )
  );
  
  const fromCookies = (req) => {
    return req.cookies.token;
  };
  
  // JWT
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        //jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        jwtFromRequest: ExtractJwt.fromExtractors([fromCookies]),
        secretOrKey: "secretJWT",
      },
      async function (jwt_payload, done) {
        done(null, jwt_payload);
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

const signupGoogle = (profile) => {
  return {
    first_name: profile._json.given_name,
    last_name: profile._json.family_name,
    email: profile._json.email,
    password: " ",
    isGoogle: true,
  };
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
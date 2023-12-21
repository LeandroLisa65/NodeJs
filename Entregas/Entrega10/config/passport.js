import passport from "passport";
import { userManager } from '../dao/mongo/UserManager.js';
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";

const cookieExtractor = req => {
  console.log(req.cookies)
  let token = null;
  if (req && req.cookies) {
      token = req.cookies[process.env.JWT_COOKIE_KEY];
  }
  return token;
};

const initPassport = () => {

  const jwtOptions = {
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: process.env.JWT_KEY,
  };

  passport.use('current', new JWTStrategy(jwtOptions, async (jwt_payload, done) => {
      try{
          return done(null, jwt_payload.user);
      }catch(error){
          return done(error);
      }
  }))
}

const signupGoogle = (profile) => {
  return {
    first_name: profile._json.given_name,
    last_name: profile._json.family_name,
    email: profile._json.email,
    password: " ",
    isGoogle: true,
  };
}

const initPassportGoogle = () => {
  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK,
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
}

export { initPassport, initPassportGoogle }
import passport from 'passport'
import UserManager from '../dao/mongo/user.mongo.js'
import jwtStrategy from 'passport-jwt'

const userManager = new UserManager

const JWTStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies[process.env.JWT_COOKIE_KEY];
    }
    return token;
};

const initPassport = () => {

    const jwtOptions = {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
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

export { initPassport }
import passport from "passport";
import { userManager } from "./dao/Dao/MongoDb/UserManager";

passport.serializeUser((user,done) => {
    done(null,user._id);
});

passport.deserializeUser(async (id,done) => {
try {
    const user = await userManager.getUserById(id);
    done(null, user)
} catch (error) {
    done(error)
}
});
import jwt from 'jsonwebtoken'

const generateToken = (user) => {
    return jwt.sign({user}, process.env.JWT_KEY, {expiresIn: '1d'});
};

const authToken = (req, res, next) => {
    const authCookie = req.headers.cookie;
    if (!authCookie) {
        return res.status(401).send({error: "User not authenticated or missing token."});
    }

    const token =  authCookie.split('=')[1];

    jwt.verify(token, process.env.JWT_KEY, (error, credentials) => {
        if (error) return res.status(403).send({error: "Token invalid, Unauthorized!"});
        req.user = credentials.user;
        next();
    });
};

function generateTokenResetPassword(user) {
    return jwt.sign({user}, process.env.JWT_RESET_PASSWORD_KEY, {expiresIn: 3600});
}

const authTokenResetPassword = (req, res, next) => {
    const token = req.params.token

    jwt.verify(token, process.env.JWT_RESET_PASSWORD_KEY, (error, credentials) => {
        if (error) return res.render('recoverpassword', {})// .status(403).send({error: "Token invalid, may have expired!"});
        req.user = credentials.user;
        next();
    });
};

const decodeJWT = (token, signature) => {
    const payload = jwt.verify(token, signature)
    return payload
}

export { generateToken, authToken, generateTokenResetPassword, authTokenResetPassword, decodeJWT }
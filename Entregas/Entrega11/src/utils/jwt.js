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

export { generateToken, authToken }
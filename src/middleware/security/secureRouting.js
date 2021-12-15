import jwt from 'jsonwebtoken';

export const secureRouteMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch(error) {
        res.clearCookie("token");
        res.status(401).send({ "Error": "401 Unauthorized" });
    }
};

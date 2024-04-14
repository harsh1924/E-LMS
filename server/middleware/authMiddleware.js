import NewError from "../utils/NewError.js";
import jwt from 'jsonwebtoken'

export const isLoggedIn = async (req, res, next) => {
    const {token} = req.cookies;
    // DECODING TOKEN USING JWT VERIFY METHOD
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    if (!token) {
        return next(new NewError('Unauthorized, please login to continue', 401));
    };
    if (!decoded) {
        return next(new NewError('Unauthorized, please login to continue', 401));
    }

    req.user = decoded; 
    next();
}
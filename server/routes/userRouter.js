import { Router } from "express";
import { getUserDetails, login, logout, signup } from "../controller/userController.js";
import upload from "../middleware/upload.js";
import { isLoggedIn } from "../middleware/authMiddleware.js";

const userRouter = Router();

userRouter.route('/signup')
    .post(upload.single("avatar"), signup);
userRouter.route('/login')
    .post(login);
userRouter.route('/logout')
    .post(logout);
userRouter.route('/me')
    .get(isLoggedIn, getUserDetails)
    

export default userRouter;
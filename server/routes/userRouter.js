import { Router } from "express";
import { login, logout, signup } from "../controller/userController.js";
import upload from "../middleware/upload.js";

const userRouter = Router();

userRouter.route('/signup')
    .post(upload.single("avatar"), signup);
userRouter.route('/login')
    .post(login);
userRouter.route('/logout')
    .post(logout);
    

export default userRouter;
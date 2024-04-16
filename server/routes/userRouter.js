import { Router } from "express";
import { changePassword, getUserDetails, login, logout, signup, updateUser } from "../controller/userController.js";
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
    .get(isLoggedIn, getUserDetails);
userRouter.route('/change-password')    
    .post(isLoggedIn, changePassword)
userRouter.route('/update/:id')
    .put(isLoggedIn, upload.single('avatar'), updateUser);
    

export default userRouter;
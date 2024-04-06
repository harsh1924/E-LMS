import { Router } from "express";
import { signup } from "../controller/userController.js";
import upload from "../middleware/upload.js";

const userRouter = Router();

userRouter.route('/signup')
    .post(upload.single("avatar") ,signup)

export default userRouter;
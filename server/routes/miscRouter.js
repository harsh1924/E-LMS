import { Router } from "express";
import { contactUs } from "../controller/miscController";

const miscRouter = Router();
miscRouter.route('/contact')
    .post(contactUs);
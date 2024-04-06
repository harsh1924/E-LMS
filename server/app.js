import { config } from "dotenv";
import cors from 'cors'
import express from "express";
import userRouter from "./routes/userRouter.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";

config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: [process.env.FRONTEND_URL],
        credentials: true
    })
);

app.use(morgan('start'));
app.use(cookieParser());

app.use('/api/auth/user', userRouter);

app.get('/', (req, res) => {
    res.status(200).send('Server Started')
});

app.all('*', (req, res) => {
    res.status(400).send('OOPS! 404 Page Not Found')
});

export default app;
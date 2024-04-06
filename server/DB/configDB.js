import mongoose from "mongoose";

mongoose.set('strictQuery', false);

const DB_URL = 'mongodb://127.0.0.1:27017/LMS-FINAL';

const configDB = () => {
    mongoose.connect(DB_URL).then(() => {
        console.log(`Database Connected to ${DB_URL}`);
    }).catch((err) => {
        console.log(err.message);
        process.exit(1);
    })
};

export default configDB;
import configDB from "./DB/configDB.js";
import app from "./app.js";
import {v2} from 'cloudinary';

v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API,
    api_secret: process.env.CLOUD_SECRET
})

const PORT = process.env.PORT;
app.listen(PORT, async () => {
    await configDB();
    console.log(`Server Started at PORT: ${PORT}`);
});
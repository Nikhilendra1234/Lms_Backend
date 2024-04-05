import app  from './App.js'
import connectToDb from './config/databaseConfig.js';
import cloudinary from 'cloudinary'


const port=process.env.PORT || 5030;

cloudinary.v2.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
});

app.listen(port,async()=>{
    await connectToDb();
    console.log(`server started at port ${port}`);
})
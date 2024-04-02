import app  from './App.js'
import connectToDb from './config/databaseConfig.js';
const port=process.env.PORT || 5030;

app.listen(port,async()=>{
    await connectToDb();
    console.log(`server started at port ${port}`);
})
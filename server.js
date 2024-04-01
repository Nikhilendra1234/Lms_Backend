import app  from './App.js'

const port=process.env.PORT || 5030;

app.listen(port,()=>{
    console.log(`server started at port ${port}`);
})
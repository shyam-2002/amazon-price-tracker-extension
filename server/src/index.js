require("dotenv").config();
let port = process.env.PORT;


const express = require("express");
const cors = require("cors");

const app = express();


require('./config/mongoose');


app.use(express.json());         //middelware for parsing json data to javascript object
app.use(cors());
app.use('/', require('./api'));



// app.use((req, res, next)=>{
//     let error = new Error('Not found');
//     error.status = 404;
//     next(error);
// })


// app.use((error, res, next)=>{
//    try{
//        res.status(error.status).json({message : error.message, success : false});
//    }
//    catch(err){
//        res.status(500).json({message: err.message, success : false});
//    }
// })


app.listen(port, ()=>{
    console.log(`server is listening on port ${port}`);
})
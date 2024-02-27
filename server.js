// Module imports
const dotenv = require('dotenv');
dotenv.config({path:'config.env'})
const app = require('./index');
const Port = process.env.PORT
const mongoose = require('mongoose');

// DB connection
mongoose.connect(process.env.CONN_STR).then(()=>{
    console.log("DB Connection Successfull");
}).catch((err)=>{
    console.log("Something went wrong in DB");
})

app.listen(Port,(err)=>{
    if(!err){
        console.log(
          "server running success fully at port : " + Port
        );
    }
    else{
        console.log(err.message);
    }
})

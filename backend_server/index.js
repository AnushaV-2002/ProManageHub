const express = require('express')
const mongoose=require('mongoose')
const cors=require('cors')
// Load environment variables from .env file
require('dotenv').config();

//Object create  in express
const app=express()
const port =  process.env.PORT;

//Middleware to check or structure the data coming from frontend
app.use(express.json())

app.use(express.urlencoded({extended: false}))

// // Allow requests only from a specific domain
// const corsOptions = {
//     origin: 'https://pro-manage-hub-inky.vercel.app/', // Replace with your frontend domain
//     optionsSuccessStatus: 200,
//     allowedHeaders: ['Content-Type', 'Authorization'] // some legacy browsers (e.g., IE11) choke on 204
//   };

// Middleware to enable CORS
app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://pro-manage-hub-inky.vercel.app");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


//For routing to routes
const authRouter = require('../backend_server/Router/authroute');
const projectRouter=require('../backend_server/Router/projectroute');

//to give api common routing
app.use('/api',authRouter)
app.use('/api',projectRouter)

app.set('view engine', 'ejs')




//DB Connection
mongoose.connect(process.env.DB_CONNECTION_STRING).then(()=>{
    console.log("DB Connected")
}).catch((err)=>{
    console.log(err)
})

//server running
app.listen(port,()=>{
    console.log('Server started Running');
})

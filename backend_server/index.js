const express = require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const port =  process.env.PORT;
// Load environment variables from .env file
require('dotenv').config();

//Object create  in express
const app=express()

//Middleware to check or structure the data coming from frontend
app.use(express.json())

// // Allow requests only from a specific domain
// const corsOptions = {
//     origin: 'https://your-frontend-domain.com', // Replace with your frontend domain
//     optionsSuccessStatus: 200 // some legacy browsers (e.g., IE11) choke on 204
//   };

// Middleware to enable CORS
app.use(cors());

app.use(express.urlencoded({extended: false}))
app.set('view engine', 'ejs')

//For routing to routes
const authRouter = require('../backend_server/Router/authroute');
const projectRouter=require('../backend_server/Router/projectroute');

//to give api common routing
app.use('/api',authRouter)
app.use('/api',projectRouter)


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

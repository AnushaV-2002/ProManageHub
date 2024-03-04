const express=require('express')
const User = require('../model/authmodel')
const Query = require('../model/querymodel')
const nodemailer = require('nodemailer')

const { authenticateToken } = require('../middleware/middleware');

//to encrypt the password and then store in the database
const bcrypt=require('bcryptjs')

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const sendgridkey = process.env.SENDGRID_API_KEY;

const jwt= require('jsonwebtoken')


//using Router method from express
const router=express.Router()

// router.get('/test',(req,res)=>{
//    res.send('API Connection Successfull')
// })

//Router to store queries
router.post('/query', (req,res)=>{
    const query = req.body;

    Query.create(query)
    .then((query)=>{
       res.status(200).json({"Message" : "Query Added Successfully"})
    })
    .catch((error)=>{
        res.status(500).json({"Message":"Internal Server Error"})
    })

})

//Sign Up Route
router.post('/signup',(req,res)=>{
   const user=req.body;
   //we need to encrypt the password which is in plain text, becuase anyone who is admin, developer or owner can miss use or hacked person can miss use it
   bcrypt.genSalt(10,(err,salt)=>{
      let password=user.Password;
      bcrypt.hash(password,salt,(err,hpass)=>{
         user.Password=hpass;
         User.create(user)
         .then(() => {
            res.send({"Message": "User Created Successfully!"});
         })
        .catch((err) => {
            console.error('Error creating user:', err);
            res.status(500).send({"Error": "An error occurred while creating the user"}); // Send a generic error message
         });
      })
    })
  
})

//Login Route
router.post('/login',(req,res)=>{

   try{ 
      let userCred=req.body;

      User.findOne({Email:userCred.Email})
      .then((user)=>{
         if(user!==null){
           bcrypt.compare(userCred.Password,user.Password,(err,result)=>{
               if(result===true){
                  //jwt token is generated
                   jwt.sign({Email:userCred.Email},jwtSecretKey,{expiresIn: '1h'},(err,token)=>{
                   if(!err){
                     res.cookie('token', token, { httpOnly: true, maxAge: 3600000,secure:true }); // Set cookie with token
                     res.json({ success: true, token,user}); // Send token in the response body
                   }
                   else{
                       res.send({"Message":"There is a problem in generating a token, try again!"})
                   }
                   })
               }
               else{
                  res.status(401).send({"Message":"Incorrect Password"})
               }
           })
         }
         else{
           res.status(404).send({"Message":"User Not Found"})
         }
      })
   }
   catch(error){
      res.status(500).send({ "Message": "An error occurred during login" });
   }
})


//Route to fetch user
router.get('/user/:id', (req, res) => {
   
      const userId = req.params.id;
   
      // Find the user by ID
      User.findOne({ _id: userId })
      .then((user)=>{
        // Structure the user object with only _id and Name fields
        const userObj = {
            _id: user._id,
             Name: user.Name
        };

        // If user exists, send the structured user object as response
        res.status(200).json(userObj);
      })
     .catch((error)=>{
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Internal server error' });
     })
 });

 //Route to fetch user email
 router.post('/user/:Email', (req, res) => {
    const { Email } = req.params;

    User.findOne({ Email: Email })
        .then((user) => {
            if (user) {
                // If user exists, send the user data
                res.json(user);
            } else {
                // If user does not exist, send an appropriate response
                res.status(404).json({ "Message": "User not found" });
            }
        })
        .catch((err) => {
            // Handle internal server error
            console.error("Error:", err);
            res.status(500).json({ "Message": "Internal Server Error!" });
        });
});



//Logout Route
router.post('/logout', (req, res) => {
   try {
     res.clearCookie('token'); // Clear token cookie on the client-side
     res.status(200).json({ message: 'Logged out successfully' });
   } catch (error) {
     console.error('Logout error:', error);
     res.status(500).json({ message: 'Internal server error' });
   }
 });


//Logics to perform forget password

router.post('/forget-password', (req,res)=>{
   const{Email} = req.body;

   User.findOne({Email: Email})
   .then((user)=>{
      if(!user){
         res.status(404).json({"Message":"User does not exist!"})
      }

      const secret = jwtSecretKey + user.Password;
      const token= jwt.sign({
         id: user._id,
         Email: user.Email
      }, secret,{expiresIn: "15m"});

      const link = `http://localhost:3000/api/reset-password/${user._id}/${token}`
    //   console.log(link)
      
      const transporter =  nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
            user: 'apikey',
            pass: sendgridkey
        }
      })

      const message = {
        from:"promanagehub@gmail.com",
        to: user.Email,
        subject: "Password Reset Request(ProManageHub)",
        html: `
                <p>Hello,</p>
                <p>You recently requested to reset your password for your ProManageHub account.</p>
                <p>Please click the link below to reset your password. This link is valid for 15 minutes and can only be used once.</p>
                <p><a href="${link}">Reset Password</a></p>
                <p>If you did not request a password reset, please ignore this email or contact support.</p>
                <p>Thank you,<br/>The ProManageHub Team</p>`
      }

      transporter.sendMail(message, (error, info) => {
        if (error) {
           console.error('Error:', error);
        } else {
           console.log('Email sent:', info.response);
        }
      });

      res.status(200).json({"Message" : "Password Reset Link is sent to your Email!"})
   })
   .catch((error)=>{
    // console.error("Database error:", error);
    res.status(500).json({ "Message": "Internal server error" });
   })

})

router.get('/reset-password/:id/:token', (req, res) => {
  const { id, token } = req.params;

  User.findOne({ _id: id })
      .then((user) => {
          if (!user) {
              return res.status(404).json({ "Message": "User does not exist!" });
          }

          const secret = jwtSecretKey + user.Password;

          try {
              // Verify the token
              jwt.verify(token, secret);
              
              // Render the reset password template with the user's email
              res.render('resetpassword', { Email: user.Email });
          } catch (error) {
              // Handle token verification error
              res.status(401).json({ "Message": "Invalid or expired token" });
          }
      })
      .catch((error) => {
          // Handle database query error
          console.error("Database error:", error);
          res.status(500).json({ "Message": "Internal server error" });
      });
});

router.post('/reset-password/:id/:token', (req, res) => {
   const { id, token } = req.params;
   const { newPassword } = req.body;

   User.findOne({ _id: id })
       .then((user) => {
           if (!user) {
               return res.status(404).json({ "Message": "User does not exist!" });
           }

           const secret = jwtSecretKey + user.Password;

           try {
               // Verify the token
               jwt.verify(token, secret);

               // Generate salt and hash the new password
               bcrypt.genSalt(10, (err, salt) => {
                   bcrypt.hash(newPassword, salt, (err, hashedPassword) => {
                       // Update user's password with the hashed password
                       User.updateOne({ _id: id }, { Password: hashedPassword })
                           .then(() => {
                               // Render success template
                               res.render('confirmationpage', { Email : user.Email, "message_status": "successfull", "message":"You can now close this window and return to the login page" });
                           })
                           .catch((err) => {
                               console.error("Error updating password:", err);
                               // Render error template
                               res.render('confirmationpage', { Email : user.Email, "message_status": "failed", "message":"Try Again to Reset Your Password!" });
                           });
                   });
               });
           } catch (error) {
               // Handle token verification error
               res.render('token-expired', { "message": "Invalid or expired token!" });
           }
       })
       .catch((error) => {
           // Handle database query error
           console.error("Database error:", error);
           res.render('database-error', { "message" : "Internal server error!" });
       });
});

//export the Router 
module.exports=router;
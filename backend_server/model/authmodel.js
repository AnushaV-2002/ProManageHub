const { Schema, model } = require('mongoose');
//Creation of User Schema 
const userSchema=Schema({
    Name:{
      type:String,
      required:[true,'Name is Mandatory']
    },
    Email:{
      type:String,
      required:[true,'Email is Mandatory']
    },
    Password:{
      type:String,
      required:[true,'Password is Mandatory']
    },
    Projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }]
  }, {timestamps:true})
  
//Model Creation
  const User=model('users',userSchema)

//export the user model
module.exports=User;